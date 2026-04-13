import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Allows unauthenticated requests; if `Authorization: Bearer` is present, validates JWT.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{ headers?: { authorization?: string } }>();
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
    const req = context.switchToHttp().getRequest<{ user?: TUser }>();
    if (err || !user) {
      req.user = undefined;
      return undefined;
    }
    return user;
  }
}
