import logger from '../logger';

export enum errcode {
	OK,
	ERROR,
	DB_ERROR,
	FILE_ERROR,
}

export function crash(code: errcode, ...print: string[]) {
	logger.error(errcode[code], ...print);
	process.exit(code);
}
