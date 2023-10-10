import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { IRequestWithUser } from '@app/interfaces';
import { CONFIRMATION_EMAIL_ERROR } from '../constants/guards.constants';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: IRequestWithUser = context.switchToHttp().getRequest();
    if (!request.user?.isEmailConfirmed) {
      throw new UnauthorizedException(CONFIRMATION_EMAIL_ERROR);
    }

    return true;
  }
}
