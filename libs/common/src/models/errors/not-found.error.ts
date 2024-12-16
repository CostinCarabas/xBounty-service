import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Error } from './error';

export class NotFoundError extends NotFoundException {
  static fromError(error: Error): NotFoundError {
    return new NotFoundError({
      ...error,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
