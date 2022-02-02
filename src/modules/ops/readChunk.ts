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

import { brotliDecompress } from 'node:zlib';

import * as database from '../db';
import * as fstore from '../fstore';

export async function readChunk(hash: string): Promise<Buffer> {
	if (await fstore.exists(hash)) {
		return fstore.read(hash);
	}

	const chunk = await database.chunks.get(hash);

	const compressed = chunk?.data;

	if (compressed) {
		return new Promise((resolve, reject) => {
			brotliDecompress(
				compressed,
				(error: Error | null, decompressed: Buffer) =>
					error ? reject(error) : resolve(decompressed)
			);
		});
	} else {
		throw new Error(`Chunk ${hash} not found!`);
	}
}
