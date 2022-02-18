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

export type User = {
	username: string; // PK
	password: string;
	authtoken: string;
	validfrom: BigInt;
	validuntil: BigInt;
	bytelimit: BigInt;
	filelimit: BigInt;
	limitsreset: BigInt;
};

export type Chunk = {
	hash: string; // PK
	owner: string; // User.username
	size: BigInt;
	data?: Buffer;
};

export type FileChunk = {
	uid: BigInt; // PK
	owner: string; // User.username
	size: string; // Chunk.size
	chunk: string; // Chunk.hash
	file: BigInt; // File.uid
};

export type File = {
	uid: BigInt; // PK
	owner: string; // User.username
	size: BigInt; // sum(Chunk.size)
	numchunks: BigInt;
	chunks: bigint[]; // Array<FileChunk.uid>
	dirname: string;
	filename: string;
	sharedwith: string[]; // Array<username>
	public: boolean;
};
