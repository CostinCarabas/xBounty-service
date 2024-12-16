import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedError } from '@XBounty/common';

@Injectable()
export class NativeRegularJwtGuard extends AuthGuard('nativeregularjwtstrategy') {
  handleRequest<T>(err: unknown, user: T, info: { name: string } | string): T {
    if (!err && user) {
      return user;
    }

    if (typeof (info) === 'string') {
      throw UnauthorizedError.fromError({
        error: info,
      });
    }

    throw UnauthorizedError.fromError({
      error: 'unauthorized',
    });
  }
}
