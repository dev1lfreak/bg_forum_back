import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();

    return next.handle().pipe(
      map((data) => {
        const elapsedMs = Date.now() - startedAt;
        const elapsedValue = `${elapsedMs}ms`;
        const type = context.getType<'http' | 'graphql' | 'rpc'>();

        if (type === 'http') {
          const http = context.switchToHttp();
          const req = http.getRequest<Request & { headers?: Record<string, string> }>();
          const res = http.getResponse<{ setHeader: (name: string, value: string) => void }>();
          res?.setHeader?.('X-Elapsed-Time', elapsedValue);

          const accepts = req?.headers?.accept ?? '';
          if (
            accepts.includes('text/html') &&
            data &&
            typeof data === 'object' &&
            !Array.isArray(data)
          ) {
            (data as Record<string, unknown>).serverElapsedTimeMs = elapsedMs;
          }
        }

        if (type === 'graphql') {
          const gqlCtx = GqlExecutionContext.create(context).getContext<{
            res?: { setHeader: (name: string, value: string) => void };
          }>();
          gqlCtx?.res?.setHeader?.('X-Elapsed-Time', elapsedValue);
        }

        return data;
      }),
    );
  }
}
