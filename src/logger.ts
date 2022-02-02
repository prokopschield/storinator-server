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

import { createLogger } from '@lvksh/logger';
import chalk from 'chalk';

import config from './config';

const logger = createLogger(
	{
		log: chalk.hex('888888')`INFO`,
		info: chalk.hex('888888')`INFO`,
		warn: chalk.hex('ff8800')`WARNING`,
		error: chalk.hex('880000')`ERROR`,
		...config.obj.logger.obj.loggers.str,
	},
	config.obj.logger.obj.options.str,
	(text: string) => process.stdout.write(text + '\n')
);

export = logger;
