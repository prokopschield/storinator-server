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

import { getConfig } from 'doge-config';

const config = getConfig('storinator', {
	DATA_DIR: '/var/storinator',
	FSTORE_DIR: 'files',
	DIVLEN: 4,
	SCYLO: {
		client: {
			keyspace: 'system',
			localDataCenter: 'datacenter1',
			contactPoints: ['localhost:9042'],
		},
		keyspace: 'storinator',
	},
	PASSWORD_LENGTH: 64,
	TOKEN_LENGTH: 64,
	HASH_LENGTH: 64,
});

export = config;
