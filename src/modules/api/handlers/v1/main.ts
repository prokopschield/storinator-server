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

import { IncomingMessage, ServerResponse } from 'node:http';

import config from '../../../../config';
import { RequestMetadata } from '../../types';
import { token } from './token';

export async function main(
	meta: RequestMetadata,
	req: IncomingMessage,
	res: ServerResponse
): Promise<object | void> {
	const endpoint = meta.pathparts.shift();

	if (endpoint === 'v1') {
		return main(meta, req, res);
	}

	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		res.setHeader(
			'Access-Control-Allow-Origin',
			config.obj.CORS.str.origin || req.headers.origin || '*'
		);
		res.setHeader(
			'Access-Control-Allow-Methods',
			config.obj.CORS.str.methods
		);
		res.setHeader(
			'Access-Control-Max-Age',
			(config.obj.CORS.num.methods ||= 60 * 60 * 24)
		);
		meta.responded = true;
	}

	if (endpoint === 'token') {
		return token(meta, req, res);
	}
}

export default main;
