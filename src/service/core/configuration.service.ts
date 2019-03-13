import {Configuration} from '../../model/config/configuration';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

/**
 * Read configuration from /config
 *
 * Note:
 * 1) Put all common configuration in common.json
 * 2) Extend common using {environment}.json, where environment is specified in NODE_ENV
 */
@Injectable()
export class ConfigurationService {
    public static DEFAULT_ENV = 'default';

    private configuration: Configuration;
    private targetEnvironment: string;

    constructor(private env: any, private configDir?: string) {
        if (configDir === undefined) {
            this.configDir = path.join(process.cwd(), 'config');
        }

        if (env.NODE_ENV) {
            this.load(env.NODE_ENV);
        } else {
            this.load(ConfigurationService.DEFAULT_ENV);
        }
    }

    get environment(): string {
        return this.targetEnvironment;
    }

    get config(): Configuration {
        return this.configuration;
    }

    load(env: string): void {
        this.targetEnvironment = env;

        const common = path.join(this.configDir, 'common.json');
        if (!fs.existsSync(common)) {
            throw Error(`Common configuration ${common} not found`);
        }

        this.configuration = JSON.parse(fs.readFileSync(common, 'utf8'));

        const file = path.join(this.configDir, `${env}.json`);
        if (!fs.existsSync(file)) {
            throw Error(`Environment configuration ${file} not found`);
        }

        const input = fs.readFileSync(file, 'utf8');
        this.configuration = this.merge(this.configuration, JSON.parse(input));

        this.overrideFromEnv(this.configuration);
    }

    private overrideFromEnv(config: any, name?: string): void {
        let propertyPath: string;

        for (const key in config) {
            if (name) {
                propertyPath = name + '_' + key.toUpperCase();
            } else {
                propertyPath = key.toUpperCase();
            }

            if (this.isObject(config[key])) {
                this.overrideFromEnv(config[key], propertyPath);
            } else {
                if (this.env[propertyPath] !== undefined) {

                    const val: string = this.env[propertyPath].trim();
                    if (val === 'true' || val === 'false') {
                        config[key] = (val === 'true');
                    } else if (!isNaN((parseFloat(val)))) {
                        config[key] = parseFloat(val);
                    } else {
                        config[key] = val;
                    }
                }
            }
        }
    }

    private isObject(obj: any): boolean {
        if (typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return true;
                }
            }
        }
        return false;
    }

    private merge(target: any, add: any): any {
        for (const key in add) {
            if (add.hasOwnProperty(key)) {
                if (target[key] && this.isObject(target[key]) && this.isObject(add[key])) {
                    this.merge(target[key], add[key]);
                } else {
                    target[key] = add[key];
                }
            }
        }

        return target;
    }
}
