import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { CurrentUser as CurrentUserPayload } from '../common/http/current-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload | undefined => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const type = ctx.getType<string>();
    if (type === 'graphql') {
      return gqlCtx.getContext().req.user as CurrentUserPayload | undefined;
    }
    return ctx.switchToHttp().getRequest().user as CurrentUserPayload | undefined;
  },
);
