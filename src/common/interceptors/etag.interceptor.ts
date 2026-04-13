import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<{
      method?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();
    const res = http.getResponse<{
      setHeader: (name: string, value: string) => void;
      status: (code: number) => void;
    }>();

    if ((req.method ?? 'GET').toUpperCase() !== 'GET') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const raw = JSON.stringify(data ?? null);
        const etag = `"${createHash('sha1').update(raw).digest('hex')}"`;
        res.setHeader('ETag', etag);

        const ifNoneMatch = req.headers?.['if-none-match'];
        const clientEtag = Array.isArray(ifNoneMatch) ? ifNoneMatch[0] : ifNoneMatch;

        if (clientEtag === etag) {
          res.status(304);
          return undefined;
        }

        return data;
      }),
    );
  }
}
