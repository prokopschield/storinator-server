import logger from '../logger';

export enum errcode {
	OK,
	ERROR,
	DB_ERROR,
	FILE_ERROR,
}

export function crash(code: errcode, ...print: string[]) {
	logger.error(errcode[code], ...print);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(code);
}
