import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { Error } from './error';

export class ForbiddenError extends ForbiddenException {
  static fromError(error: Error): ForbiddenError {
    return new ForbiddenError({
      ...error,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
