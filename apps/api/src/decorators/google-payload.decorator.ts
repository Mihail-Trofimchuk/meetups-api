import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { GooglePayload } from '@app/interfaces';

export const GetGooglePayload = createParamDecorator(
  (_: undefined, context: ExecutionContext): GooglePayload => {
    const request = context.switchToHttp().getRequest();
    const user = request?.user as GooglePayload;
    return user;
  },
);
