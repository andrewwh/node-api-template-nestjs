import { Logger as NestJsLogger } from '@nestjs/common';
import { Logger } from './logger';
import * as Bunyan from 'bunyan';
import * as BunyanFormat from 'bunyan-format';
import { Configuration } from '../../model/config/configuration';
import { mkdirSync, existsSync } from 'fs-plus';
import { parse } from 'path';

class NestLoggingBridge extends NestJsLogger {
    constructor(private logger: Bunyan) {
        super();
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
}

class ApplicationLogger implements Logger {
    constructor(private logger: Bunyan) {
    }

    debug(message: string, data?: any): void {
        if (data) {
            this.logger.debug(data, message);
        } else {
            this.logger.debug(message);
        }
    }

    warn(message: string, data?: any): void {
        if (data) {
            this.logger.warn(data, message);
        } else {
            this.logger.warn(message);
        }
    }

    info(message: string, data?: any): void {
        if (data) {
            this.logger.info(data, message);
        } else {
            this.logger.info(message);
        }
    }

    error(message: string, data?: any): void {
        if (data) {
            this.logger.error(data, message);
        } else {
            this.logger.error(message);
        }
    }

    fatal(message: string, data?: any): void {
        if (data) {
            this.logger.fatal(data, message);
        } else {
            this.logger.fatal(message);
        }
    }
}

export class LoggingFactory {
    private logger: Bunyan;

    constructor(config: Configuration) {
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

    getNestBridgeLogger(): NestLoggingBridge {
        return new NestLoggingBridge(this.logger);
    }

    getApplicationLogger(): Logger {
        return new ApplicationLogger(this.logger);
    }
} ``