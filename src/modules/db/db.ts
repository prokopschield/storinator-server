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

import { ScylloClient } from 'scyllo';

import config from '../../config';
import { Chunk, File, FileChunk, User } from './types';

const database = new ScylloClient<{
	chunks: Chunk;
	files: File;
	fileChunks: FileChunk;
	users: User;
}>({
	client: {
		keyspace: config.obj.SCYLO.obj.client.str.keyspace,
		localDataCenter: config.obj.SCYLO.obj.client.str.localDataCenter,
		contactPoints:
			config.obj.SCYLO.obj.client.obj.localDataCenter.array.map(
				(contactPoint) => String(contactPoint)
			),
	},
});

database.useKeyspace(config.obj.SCYLO.str.keyspace);

export = database;
