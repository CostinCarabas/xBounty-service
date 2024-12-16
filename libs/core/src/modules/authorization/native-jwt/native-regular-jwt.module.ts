import { InMemoryCacheModule } from '@multiversx/sdk-nestjs-cache';
import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { NativeRegularJwtStrategy } from './native-regular-jwt.strategy';
import { NativeJwtConfig } from './config';

@Module({})
export class NativeRegularJwtModule {
  static register(
    config: NativeJwtConfig,
  ): DynamicModule {
    return {
      module: NativeRegularJwtModule,
      imports: [
        InMemoryCacheModule.forRoot({
          skipItemsSerialization: true,
        }),
        PassportModule.register({
          defaultStrategy: 'nativeregularjwtstrategy',
        }),
      ],
      providers: [
        NativeRegularJwtStrategy,
        {
          provide: NativeJwtConfig,
          useValue: config,
        },
      ],
    };
  }
}
