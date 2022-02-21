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

import { blake2s } from 'blakets';
import { Hashable } from 'blakets/lib/util';

import config from '../../config';

const { SHORT_HASH_LENGTH } = config.num;

const length = Math.floor((SHORT_HASH_LENGTH / 8) * 6);

export function shorthash(...input: Hashable[]) {
	return Buffer.from(blake2s(input, undefined, length)).toString('base64');
}
