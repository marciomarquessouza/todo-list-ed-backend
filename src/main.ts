import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 5000;
  await app.listen(port);

  logger.log(`Running on port ${port}`);
}
bootstrap();
