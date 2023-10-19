import { Catch, NotFoundException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, throwError } from 'rxjs';
import { USER_NOT_FOUND_ERROR } from '../apps/user-meetup/user-meetup.constants';

export const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    if (exception.message === USER_NOT_FOUND_ERROR) {
      return throwError(() => {
        throw new NotFoundException(USER_NOT_FOUND_ERROR);
      });
    } else {
      return throwError(() => exception.getError());
    }
  }
}
