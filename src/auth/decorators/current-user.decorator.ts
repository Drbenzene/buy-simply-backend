import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { StaffAccount } from 'utils/types';

const getCurrentUserByContext = (ctx: ExecutionContext): StaffAccount => {
  return ctx.switchToHttp().getRequest().user;
};

export const AuthenticatedStaff = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
