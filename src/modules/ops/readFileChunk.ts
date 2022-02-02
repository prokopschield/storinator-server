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
import { readChunk } from './readChunk';

export async function readFileChunk(uid: bigint): Promise<Buffer> {
	const fileChunk = await database.filechunks.get(uid);

	if (fileChunk?.chunk) {
		return readChunk(fileChunk.chunk);
	} else {
		throw new Error(`FileChunk ${uid} not found!`);
	}
}
