import { Module } from '@nestjs/common';
import { getGithubApiConfiguration, getRedisConfiguration } from '../../config';
import { ClusterCronCheckerModule, ConfigUtils } from '@XBounty/common';
import { EventsProcessorCron } from './transaction-processor.cron';
import { TransactionProcessorService } from './transaction-processor.service';
import { CacheModule } from '@multiversx/sdk-nestjs-cache';
import { AppInstallationsModule } from '@XBounty/core';
import { GithubApiModule } from '@XBounty/external-apis';

@Module({
  imports: [
    ClusterCronCheckerModule.register(
      getRedisConfiguration(),
    ),
    CacheModule.forRoot(ConfigUtils.buildRedisOptions(getRedisConfiguration())),
    AppInstallationsModule.register(
      ConfigUtils.buildRedisOptions(getRedisConfiguration()),
    ),
    GithubApiModule.register(
      getGithubApiConfiguration(),
    ),
  ],
  providers: [
    TransactionProcessorService,
    EventsProcessorCron,
  ],
})
export class TransactionProcessorModule { }
