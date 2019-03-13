import { ConfigurationService } from './configuration.service';
import {BunyanLogger} from './bunyan.logger';
import * as fs from 'fs-plus';

// This is a bit of a hack as once compiled it will not be in the source directory
let dir = './config';
if (fs.existsSync('./src/config')) {
    dir = './src/config';
}

const configSvc = new ConfigurationService(process.env, dir);

export const configurationFactory = {
    provide: 'Configuration',
    useValue: configSvc.config
};

export const bunyanLogger = new BunyanLogger(configSvc.config);
export const loggerFactory = {
    provide: 'Logger',
    useValue: bunyanLogger.logger
};