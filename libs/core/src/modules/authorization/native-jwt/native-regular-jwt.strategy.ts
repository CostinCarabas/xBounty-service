import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { NativeAuthServer } from '@multiversx/sdk-native-auth-server';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport';
import { Request } from 'express';
import { InMemoryCacheService } from '@multiversx/sdk-nestjs-cache';
import { NativeJwtConfig } from './config';
import { NativeJwtUtils } from './utils';
import { RegularJwtUser } from './models';
import { MultiversXUtils } from '@XBounty/common';

@Injectable()
export class NativeRegularJwtStrategy extends PassportStrategy(Strategy, 'nativeregularjwtstrategy') {
  private readonly authServer: NativeAuthServer;

  constructor(
    private readonly config: NativeJwtConfig,
    protected readonly inMemoryCacheService: InMemoryCacheService,
  ) {
    super();
    this.authServer = NativeJwtUtils.initializeNativeAuthServer(this.config, this.inMemoryCacheService);
  }

  async authenticate(request: Request): Promise<void> {
    const jwt = this.getJwt(request);
    if (jwt == null) {
      this.fail('missing_native_jwt', HttpStatus.UNAUTHORIZED);
      return;
    }

    let address: string | undefined;
    try {
      const jwtUserInfo = await this.authServer.validate(jwt);
      address = jwtUserInfo.address;
    } catch (error) {
      console.log(error);
      this.fail('unauthorized_native_jwt', HttpStatus.UNAUTHORIZED);
    }

    if (address == null || !MultiversXUtils.isValidAddress(address)) {
      this.fail('invalid_address', HttpStatus.UNAUTHORIZED);
      return;
    }

    const user: RegularJwtUser = {
      address: address,
    };

    this.success(user);
  }

  private getJwt(request: Request): string | null {
    const extractAuthHeader = ExtractJwt.fromAuthHeaderAsBearerToken();
    return extractAuthHeader(request);
  }
}
