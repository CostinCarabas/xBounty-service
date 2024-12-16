import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RabbitContextCheckerService } from '@multiversx/sdk-nestjs-rabbitmq';
import { ErrorsUtils } from '../utils';
import { Logger } from '../modules';

@Injectable()
export class RabbitMqInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly rabbitContextCheckerService: RabbitContextCheckerService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isRmqContext = this.rabbitContextCheckerService.check(context);
    if (!isRmqContext) {
      return next.handle();
    }

    return next.handle().pipe(
      catchError((err) => {
        const apiFunction = context.getClass().name + '.' + context.getHandler().name;
        this.logger.error('An error occurred while executing RabbitMq Handler.', {
          method: apiFunction,
          error: ErrorsUtils.getError(err),
          arguments: context.getArgByIndex(0),
        });

        return of(void 0);
      }),
    );
  }
}
