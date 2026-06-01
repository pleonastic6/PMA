import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { buildAppConfig } from './common/config/app-config';
import { GlobalHttpExceptionFilter } from './common/http/http-exception.filter';
import { LoggingInterceptor } from './common/http/logging.interceptor';
import { AppModule } from './modules/platform/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = buildAppConfig();

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.corsOrigin,
    credentials: true,
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(config.port);
}

void bootstrap();
