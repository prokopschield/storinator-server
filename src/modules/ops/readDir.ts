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
import { normalizeFilename } from './normalizeFilename';

export async function readDir(
	username: string,
	dirname: string
): Promise<Pick<database.types.File, keyof database.types.File>[]> {
	dirname = normalizeFilename(dirname);
	const files = await database.files.getBy({ owner: username, dirname });

	if (dirname.startsWith('users/')) {
		const [, user, ...parts] = dirname.split(/\//g);

		files.push(
			...(await readDir(user, parts.join('/'))).filter(
				(file) => file.sharedwith?.includes(username) || file.public
			)
		);
	}

	return files;
}
