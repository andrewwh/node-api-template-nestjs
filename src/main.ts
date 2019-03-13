import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from './model/config/configuration';
import * as Bunyan from 'bunyan';
import {bunyanLogger} from './service/core/core.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {logger: bunyanLogger});

    const configuration = app.get<Configuration>('Configuration');
    const logger = app.get<Bunyan>('Logger');

    logger.info(`Base path is ${configuration.basePath}`);
    app.setGlobalPrefix(configuration.basePath);

    logger.info(`Listening on port ${configuration.port}`);
    await app.listen(configuration.port);
  } catch (ex) {
    console.error(ex);
    process.exit();
  }
}
bootstrap();
