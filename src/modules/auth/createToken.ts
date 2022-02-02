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

import { hash, verify } from 'doge-passwd';

import config from '../../config';
import * as database from '../db';
import { queue } from '../db/queue';

export async function createToken(
	username: string,
	password: string
): Promise<string> {
	const user = await database.users.get(username);

	if (!user?.password) {
		throw new Error('User not found.');
	}

	if (!verify(password, user.password)) {
		throw new Error('Incorrect password.');
	}

	return new Promise((resolve) => {
		queue(async () => {
			const token = hash(password, config.num.TOKEN_LENGTH);

			user.token = hash(token, config.num.HASH_LENGTH);
			resolve(token);
			await database.users.set(user);
		});
	});
}
