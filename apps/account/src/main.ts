import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AccountModule } from './account.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './filters/rpc.exeptions';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'account_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}

bootstrap();
