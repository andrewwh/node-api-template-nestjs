import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { configurationProvider, loggerProvider } from './service/core/core.module';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, configurationProvider, loggerProvider],
})
export class AppModule {}
