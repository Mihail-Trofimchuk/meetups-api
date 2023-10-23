import { Catch, NotFoundException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../apps/user-meetup/user-meetup.constants';

export const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    if (exception.message === ERROR_MESSAGES.USER_NOT_FOUND) {
      return throwError(() => {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      });
    } else {
      return throwError(() => exception.getError());
    }
  }
}
