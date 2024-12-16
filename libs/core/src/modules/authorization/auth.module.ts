import { RedisCacheModuleOptions } from '@multiversx/sdk-nestjs';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
  UserByAddressLoaderModule,
} from '@XBounty/db-loaders';
import { NativeRegularJwtStrategy } from './native-jwt/native-regular-jwt.strategy';

@Module({})
export class AuthModule {
  static forRoot(redisOptions: RedisCacheModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: 'nativeregularjwtstrategy',
        }),
        UserByAddressLoaderModule.register(redisOptions),
      ],
      providers: [
        NativeRegularJwtStrategy,
      ],
    };
  }
}
