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

import database from './db';
import { queue } from './queue';
import { User } from './types';

const TABLE_NAME = 'users';

queue(() =>
	database.createTable(
		TABLE_NAME,
		true,
		{
			username: {
				type: 'ascii',
			},
			password: {
				type: 'ascii',
			},
			authToken: {
				type: 'ascii',
			},
			validFrom: {
				type: 'bigint',
			},
			validUntil: {
				type: 'bigint',
			},
			byteLimit: {
				type: 'bigint',
			},
			fileLimit: {
				type: 'bigint',
			},
			limitsReset: {
				type: 'bigint',
			},
		},
		'username'
	)
);

export function get(username: string) {
	return database.selectOneFrom(TABLE_NAME, '*', { username });
}

export function set(data: Partial<User>) {
	return database.insertInto(TABLE_NAME, data);
}
