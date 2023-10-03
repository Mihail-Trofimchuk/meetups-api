import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { RpcExceptionToHttpExceptionFilter } from './filters/rpc.exception';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
