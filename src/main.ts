import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from './model/config/configuration';
import {Logger} from './service/core/logger';
import {LogFactory} from './service/core/core.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {logger: LogFactory.getNestBridgeLogger()});

    const configuration = app.get<Configuration>('Configuration');
    const logger = app.get<Logger>('Logger');

    logger.info(`Base path is ${configuration.basePath}`);
    app.setGlobalPrefix(configuration.basePath);

    logger.info(`Listening on port ${configuration.port}`);
    await app.listen(configuration.port);

    // Trap process signals
    logger.info('Registering process signal hooks');

    process.on('exit', () => {
      logger.info('Process has exited');
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM: Request to terminate received. Application is stopping...');
      process.exit();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT: Request to interrupt received. Application is stopping...');
      process.exit();
    });

    process.on('SIGHUP', () => {
      logger.info('SIGHUP: Request to hang-up received. Ignoring signal.');
    });
  } catch (ex) {
    console.error(ex);
    process.exit();
  }
}

bootstrap();
