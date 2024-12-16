import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Error } from './error';

export class InternalServerError extends InternalServerErrorException {
  static fromError(error: Error): InternalServerError {
    return new InternalServerError({
      ...error,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
