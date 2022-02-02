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

import * as database from '../db';
import { readFileChunk } from './readFileChunk';

export async function readFile(uid: bigint): Promise<Buffer> {
	const file = await database.files.get(uid);

	if (!file?.chunks) {
		throw `File ${file} not found!`;
	}

	return Buffer.concat(
		await Promise.all(file.chunks.map((chunk) => readFileChunk(chunk)))
	);
}
