import { CacheModule, RedisCacheModuleOptions } from '@multiversx/sdk-nestjs-cache';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { SqlDatabaseModule, UserEntity, UserEntityRepository } from '@XBounty/db';
import { UserByAddressLoaderService } from './user-by-address-loader.service';

@Module({})
export class UserByAddressLoaderModule {
  static register(redisOptions: RedisCacheModuleOptions): DynamicModule {
    return {
      module: UserByAddressLoaderModule,
      imports: [
        CacheModule.forRoot(redisOptions),
        SqlDatabaseModule.forFeature(
          [
            UserEntity,
          ],
          [
            UserEntityRepository,
          ],
        ),
      ],
      providers: [
        UserByAddressLoaderService,
      ],
      exports: [
        UserByAddressLoaderService,
      ],
    };
  }
}
