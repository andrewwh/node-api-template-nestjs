import { Logger } from '@nestjs/common';
import * as Bunyan from 'bunyan';
import * as BunyanFormat from 'bunyan-format';
import { Configuration } from '../../model/config/configuration';
import { mkdirSync, existsSync } from 'fs-plus';
import { parse } from 'path';

export class BunyanLogger extends Logger {
    public logger: Bunyan;

    constructor(config: Configuration) {
        super();

        const settings: Bunyan.LoggerOptions = {
            name: 'application',
            streams: []
        };

        if (config.logging.file) {
            const path = parse(config.logging.file.path);
            if (path.dir !== './' && !existsSync(path.dir)) {
                mkdirSync(path.dir);
            }

            const file:any = {
                type: 'file',
                level: Bunyan.levelFromName[config.logging.level.toLocaleLowerCase()],
                path: config.logging.file.path                
            }

            if (config.logging.file.format == 'pretty') {
                file.stream = new BunyanFormat({
                    outputMode: 'short'
                });
            }            

            settings.streams.push(file);
        }

        if (config.logging.stdout) {
            const stdout:any = {
                level: Bunyan.levelFromName[config.logging.level.toLocaleLowerCase()]
            };

            if (config.logging.stdout.format == 'pretty') {
                stdout.stream = new BunyanFormat({
                    outputMode: 'short'
                });
            }

            settings.streams.push(stdout);
        }

        this.logger = Bunyan.createLogger(settings);
    }

    log(message: any, context?: string): any {
        this.logger.info({ context }, message);
    }

    error(message: any, trace?: string, context?: string): any {
        this.logger.error({ trace, context }, message);
    }

    warn(message: any, context?: string): any {
        this.warn({ context }, message)
    }
} ``