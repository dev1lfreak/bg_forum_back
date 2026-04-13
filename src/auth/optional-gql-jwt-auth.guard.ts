import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Allows unauthenticated GraphQL requests; if `Authorization: Bearer` is present, validates JWT.
 */
@Injectable()
export class OptionalGqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as { headers?: { authorization?: string }; user?: unknown };
  }

  canActivate(context: ExecutionContext) {
    const req = this.getRequest(context);
    const auth = req.headers?.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return true;
    }
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  handleRequest<TUser = unknown>(
    err: Error | undefined,
    user: TUser,
    _info: unknown,
    context: ExecutionContext,
  ): TUser | undefined {
    const req = this.getRequest(context) as { user?: TUser };
    if (err || !user) {
      req.user = undefined;
      return undefined;
    }
    return user;
  }
}
