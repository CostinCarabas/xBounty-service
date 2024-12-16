import { HttpStatus, HttpException } from '@nestjs/common';
import { Error } from './error';

export class TooManyRequestsError extends HttpException {
  static fromError(error: Error): TooManyRequestsError {
    return new HttpException({
      ...error,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    }, HttpStatus.TOO_MANY_REQUESTS);
  }
}
