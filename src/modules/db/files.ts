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
import { default as queueObject, queue } from './queue';
import { File } from './types';

const TABLE_NAME = 'files';

queue(() =>
	database.createTable(
		TABLE_NAME,
		true,
		{
			uid: {
				type: 'bigint',
			},
			odf: {
				type: 'ascii',
			},
			owner: {
				type: 'ascii',
			},
			size: {
				type: 'bigint',
			},
			numchunks: {
				type: 'bigint',
			},
			chunks: {
				type: 'list',
				typeDef: 'bigint',
			},
			dirname: {
				type: 'ascii',
			},
			filename: {
				type: 'ascii',
			},
			sharedwith: {
				type: 'list',
				typeDef: 'ascii',
			},
			public: {
				type: 'boolean',
			},
		},
		'uid'
	)
);

queueObject.promise.then(() => {
	for (const column of ['owner', 'dirname', 'filename']) {
		queueObject.promise.then(() =>
			queue(() =>
				database.createIndex(
					TABLE_NAME,
					`${TABLE_NAME}_by_${column}`,
					column as keyof File
				)
			)
		);
	}
});

export function getBy(pick: Partial<File>) {
	return database.selectFrom(TABLE_NAME, '*', pick);
}

export function get(uid: bigint) {
	return database.selectOneFrom(TABLE_NAME, '*', { uid });
}

export function set(data: Partial<File>) {
	return database.insertInto(TABLE_NAME, data);
}
