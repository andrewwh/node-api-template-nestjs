import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import {Logger} from './service/core/logger'
import {Hello} from './model/api/hello';

@Controller()
export class AppController {
  constructor(@Inject('Logger') private logger: Logger, private readonly appService: AppService) {}

  @Get('hello')
  async getHello(): Promise<Hello> {
    this.logger.info(`Call to hello is replying '${this.appService.getHello()}'`);

    return {
      message: this.appService.getHello()
    }
  }
}
