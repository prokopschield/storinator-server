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

import { encode as JsonEncode } from 'doge-json';
import assert from 'node:assert';
import http from 'node:http';
import { inspect } from 'node:util';

import config from '../../config';
import logger from '../../logger';
import { normalizeFilename } from '../ops';
import v1 from './handlers/v1/main';
import { readAuthHeader } from './transforms';
import { RequestMetadata } from './types';
import { verify } from './verify';

export const server = http.createServer(async (req, res) => {
	try {
		const meta: RequestMetadata = {
			username: '',
			pathparts: normalizeFilename(
				new URL(req.url || '/', 'http://localhost').pathname
			).split('/'),
			responded: false,
		};

		try {
			const { username, password, token } = readAuthHeader(req.headers);

			assert(await verify(username, password, token));

			meta.username = username;
		} catch {
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic');

			return void res.end();
		}

		const response = await v1(meta, req, res);

		if (!meta.responded) {
			res.setHeader('Content-Type', 'Application/JSON');
			res.write(JsonEncode(response));
		}
	} catch (error) {
		if (!res.headersSent) {
			res.statusCode = 400;
			res.setHeader('content-type', 'text/plain');
			res.write(inspect(error));
		}
	}

	res.end();
});

const port = (config.num.HTTP_PORT ||= 3000);

server.listen(port);

server.on('listening', () => {
	logger.info(`Listening on port ${port}.`);
});
