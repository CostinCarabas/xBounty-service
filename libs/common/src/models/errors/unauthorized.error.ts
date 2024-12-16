import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Error } from './error';

export class UnauthorizedError extends UnauthorizedException {
  static fromError(error: Error): UnauthorizedError {
    return new UnauthorizedError({
      ...error,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
