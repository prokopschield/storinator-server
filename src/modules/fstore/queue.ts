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

import { SerialQueue } from 'ps-std/lib/classes/SerialQueue';
import { crash, errcode } from '../error';

export const queueObj = new SerialQueue((error) => crash(errcode.FILE_ERROR, error));

export default queueObj;

export function queue<T>(callback: () => Promise<T>): Promise<T> {
	return new Promise(async (resolve) => {
		queueObj.add(async () => {
			resolve(await callback());
		});
	});
}
