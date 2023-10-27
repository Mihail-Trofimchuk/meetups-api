import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AccountModule } from './account.module';
import { ExceptionFilter } from './filters/rpc.exeptions';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rmq:5672'],
        queue: 'account_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
}

bootstrap();
