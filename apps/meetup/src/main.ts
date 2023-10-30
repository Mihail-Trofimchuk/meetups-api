import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MeetupModule } from './meetup.module';
import { ExceptionFilter } from './filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MeetupModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rmq:5672'],
        queue: 'meetup_queue',
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
