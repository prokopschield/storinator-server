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

import * as J from 'doge-json';
import { IncomingHttpHeaders } from 'node:http';

import config from '../../config';
import { DEFAULT_USER, ERRMGR_INVALID_AUTH_HEADER } from './constants';

/** does not verify credentials */
export function readAuthHeader(headers: IncomingHttpHeaders): {
	username: string;
	password?: string;
	token?: string;
} {
	const authHeader = headers.authorization;

	if (!authHeader) {
		return { username: DEFAULT_USER };
	}

	const matchBasic = authHeader.match(/^basic (.*)$/i);

	if (matchBasic) {
		const [, base64] = matchBasic;

		if (!base64) {
			throw new Error(ERRMGR_INVALID_AUTH_HEADER);
		}

		const decoded = String(Buffer.from(base64, 'base64'));
		const split = decoded.split(':');
		const [username, password] = split;

		if (username && password) {
			return { username, password };
		} else {
			throw new Error(ERRMGR_INVALID_AUTH_HEADER);
		}
	}

	const matchBearer = authHeader.match(/^bearer ([\w~]+)$/i);

	if (matchBearer) {
		const [, base64] = matchBearer;

		if (!base64) {
			throw new Error(ERRMGR_INVALID_AUTH_HEADER);
		}

		const username = base64.slice(0, -config.num.TOKEN_LENGTH);
		const token = base64.slice(username.length);

		if (username && token) {
			return { username, token };
		} else {
			throw new Error(ERRMGR_INVALID_AUTH_HEADER);
		}
	}

	return { username: DEFAULT_USER };
}

export function parseJsonBuffer(json: Buffer | string): {
	[index: string]: any;
} {
	const data = J.decode(String(json));

	return data && typeof data === 'object' ? data : { data };
}
