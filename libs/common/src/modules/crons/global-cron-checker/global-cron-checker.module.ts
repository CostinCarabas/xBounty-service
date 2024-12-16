import { RedisModule } from '@multiversx/sdk-nestjs-redis';
import { DynamicModule, Module } from '@nestjs/common';
import { RedisConfigurationInterface } from '@XBounty/config';
import { GlobalCronCheckerService } from './global-cron-checker.service';

@Module({})
export class GlobalCronCheckerModule {
  static register(
    redisConfigurationInterface: RedisConfigurationInterface,
  ): DynamicModule {
    return {
      module: GlobalCronCheckerModule,
      imports: [
        RedisModule.forRoot({
          config: {
            ...redisConfigurationInterface,
            tls: redisConfigurationInterface.tls === true ? {} : undefined,
          },
        }, 'common'),
      ],
      providers: [GlobalCronCheckerService],
      exports: [GlobalCronCheckerService],
    };
  }
}
