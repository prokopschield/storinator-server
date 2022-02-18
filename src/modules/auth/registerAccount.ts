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

import { hash } from 'doge-passwd';

import config from '../../config';
import * as database from '../db';
import { queue } from '../db/queue';
import { generateUid } from '../uid';

export async function registerAccount(
	username: string,
	password: string
): Promise<string> {
	username = String(username)
		.replace(/[^a-z]/gi, '')
		.slice(0, 16);
	if (!username) {
		throw new Error('Invalid username.');
	}

	return new Promise((resolve, reject) => {
		queue(async () => {
			if (await database.users.get(username)) {
				return reject(new Error(`Username taken.`));
			}

			const ret_token = hash(password, config.num.TOKEN_LENGTH);
			const authtoken = hash(ret_token, config.num.HASH_LENGTH);

			const user: database.types.User = {
				username,
				password: hash(password, config.num.HASH_LENGTH),
				authtoken,
				bytelimit: BigInt(config.num.FREE_STORAGE_BYTES),
				filelimit: BigInt(config.num.FREE_STORAGE_FILES),
				limitsreset: BigInt(generateUid()),
				validfrom: BigInt(generateUid()),
				validuntil: BigInt(
					Date.now() + config.num.DEFAULT_TOKEN_VALIDITY
				),
			};

			await database.users.set(user);
			resolve(ret_token);
		});
	});
}
