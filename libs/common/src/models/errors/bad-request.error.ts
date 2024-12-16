import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Error } from './error';

export class BadRequestError extends BadRequestException {
  static fromError(error: Error): BadRequestError {
    return new BadRequestError({
      ...error,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
