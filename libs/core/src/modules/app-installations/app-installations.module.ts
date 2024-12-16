import { CacheModule, RedisCacheModuleOptions } from '@multiversx/sdk-nestjs-cache';
import { DynamicModule, Module } from '@nestjs/common';
import { AppInstallationsService } from './app-installations.service';

@Module({})
export class AppInstallationsModule {
  static register(
    cacheOptions: RedisCacheModuleOptions,
  ): DynamicModule {
    return {
      module: AppInstallationsModule,
      imports: [
        CacheModule.forRoot(cacheOptions, {
          skipItemsSerialization: true,
        }),
      ],
      providers: [
        AppInstallationsService,
      ],
      exports: [
        AppInstallationsService,
      ],
    };
  }
}
