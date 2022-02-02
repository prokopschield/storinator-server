/**
 * storinator - my personal storage server
 * Copyright (C) 2022 Prokop Schield
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { blake2sHex } from 'blakets';
import fs from 'node:fs';
import path from 'node:path';
import { createBrotliCompress } from 'node:zlib';

import { divLen as divLength, rootDir } from './constants';
import { queue } from './queue';
import { read } from './read';

export function write(data: Buffer): Promise<string> {
	return queue(async () => {
		const hash = blake2sHex(data);
		const dirName = path.resolve(rootDir, hash.slice(0, divLength));

		if (!fs.existsSync(dirName)) {
			await fs.promises.mkdir(dirName);
		}

		const fileName = path.resolve(dirName, hash);

		if (fs.existsSync(fileName)) {
			const data = await read(hash);

			if (blake2sHex(data) === hash) {
				return hash;
			}
		}

		const writeStream = fs.createWriteStream(fileName);
		const compressor = createBrotliCompress();

		compressor.pipe(writeStream);
		compressor.write(data);
		compressor.end();

		return new Promise((resolve) =>
			compressor.on('end', () => resolve(hash))
		);
	});
}
