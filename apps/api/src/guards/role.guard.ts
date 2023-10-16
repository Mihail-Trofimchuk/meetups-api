import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { Role } from '@prisma/client';

const RoleGuard = (...roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user.user;

      return roles.some((role) => user?.role.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;