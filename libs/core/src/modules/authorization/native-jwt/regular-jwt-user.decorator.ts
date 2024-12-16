import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RegularJwtUser } from './models';

export const RegularJwtUserDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RegularJwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
