import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = 404;

    if (error && error.statusCode) {
      statusCode = error.statusCode;
    }

    response.status(statusCode).json(error);
  }
}
