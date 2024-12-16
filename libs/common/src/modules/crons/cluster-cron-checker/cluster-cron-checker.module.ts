import { RedisModule } from '@multiversx/sdk-nestjs-redis';
import { DynamicModule, Module } from '@nestjs/common';
import { RedisConfigurationInterface } from '@XBounty/config';
import { ClusterCronCheckerService } from './cluster-cron-checker.service';

@Module({})
export class ClusterCronCheckerModule {
  static register(
    redisConfigurationInterface: RedisConfigurationInterface,
  ): DynamicModule {
    return {
      module: ClusterCronCheckerModule,
      imports: [
        RedisModule.forRoot({
          config: {
            ...redisConfigurationInterface,
            tls: redisConfigurationInterface.tls === true ? {} : undefined,
          },
        }, 'default'),
      ],
      providers: [ClusterCronCheckerService],
      exports: [ClusterCronCheckerService],
    };
  }
}
