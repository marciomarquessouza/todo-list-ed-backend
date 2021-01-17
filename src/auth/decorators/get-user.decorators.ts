import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequest } from '../user.interface';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<IRequest>();
  return req.user;
});
