import { Controller, Get, Head } from '@nestjs/common';
import { AppService } from './app.service';
import { Health, ApplicationInfo } from './model/api/health.model';
import * as fs from 'fs-plus';
import * as path from 'path';

@Controller('/health')
export class HealthController {
    private pkg: any;

    constructor(private readonly appService: AppService) {
        let pkgFile = path.join(process.cwd(), 'package.json');
        while (!fs.existsSync(pkgFile) && path.dirname(pkgFile) !== '/') {
            pkgFile = path.join(path.dirname(pkgFile), '..', 'package.json');
        }

        this.pkg = JSON.parse(fs.readFileSync(pkgFile).toString());
    }

    @Get('heartbeat')
    @Head('heartbeat')
    getHeartbeat(): Health {
        return {
            name: this.pkg.name,
            version: this.pkg.version,
            time: new Date()
        }
    }

    @Get('info')
    getApplicationInfo(): ApplicationInfo {
        return {
            version: this.pkg.version,
            name: this.pkg.name,
            time: new Date(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        };
    }    
}
