import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class PendingRequestsInterceptor implements NestInterceptor {
  private pendingRequestsDictionary: { [key: string]: unknown } = {};

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly metricsService: MetricsService,
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const apiFunction =
      context.getClass().name + '.' + context.getHandler().name;

    const cacheKey = this.getCacheKey(context);
    if (cacheKey) {
      const pendingRequest = this.pendingRequestsDictionary[cacheKey];
      if (pendingRequest) {
        const result = await pendingRequest;
        this.metricsService.incrementPendingApiHit(apiFunction);
        return of(result);
      }

      let pendingRequestResolver: (value: unknown) => void;
      this.pendingRequestsDictionary[cacheKey] = new Promise((resolve) => {
        pendingRequestResolver = resolve;
      });

      return next.handle().pipe(
        tap(async (result) => {
          delete this.pendingRequestsDictionary[cacheKey ?? ''];
          pendingRequestResolver(result);
        }),
        catchError((error) => {
          delete this.pendingRequestsDictionary[cacheKey ?? ''];
          pendingRequestResolver(error);

          return throwError(() => error);
        }),
      );
    }

    return next.handle();
  }

  getCacheKey(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;

    const request = context.getArgByIndex(0);
    if (httpAdapter.getRequestMethod(request) !== 'GET') {
      return undefined;
    }

    return httpAdapter.getRequestUrl(request);
  }
}
