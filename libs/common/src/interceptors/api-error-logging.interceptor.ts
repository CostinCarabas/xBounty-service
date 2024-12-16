import {
  CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '../modules';
import { ErrorsUtils } from '../utils';

@Injectable()
export class ApiErrorLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const contextType: string = context.getType();
    if (!['http', 'https'].includes(contextType)) {
      return next.handle();
    }

    const apiFunction = context.getClass().name + '.' + context.getHandler().name;

    return next
      .handle()
      .pipe(
        catchError(error => {
          if (error instanceof HttpException) {
            if (error.getStatus() < 500) {
              return throwError(() => error);
            }
          }

          this.logger.error(`An error occurred during API call ${apiFunction}.`, {
            error: ErrorsUtils.getError(error),
          });

          return throwError(() => error);
        }),
      );
  }
}
