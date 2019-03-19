import { ConfigurationService } from './configuration.service';
import {LoggingFactory} from './bunyan.logger';
import * as fs from 'fs-plus';

let dir = './config';

if (process.env['CONFIG_DIR']) {
    dir = process.env['CONFIG_DIR'];
}
else {
    // This is a bit of a hack as once compiled it will not be in the source directory
    if (fs.existsSync('./src/config')) {
        dir = './src/config';
    }
}

const configSvc = new ConfigurationService(process.env, dir);

export const configurationProvider = {
    provide: 'Configuration',
    useValue: configSvc.config
};

export const LogFactory = new LoggingFactory(configSvc.config);
export const loggerProvider = {
    provide: 'Logger',
    useValue: LogFactory.getApplicationLogger()
};