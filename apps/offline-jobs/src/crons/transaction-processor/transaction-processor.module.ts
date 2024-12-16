import { Module } from '@nestjs/common';
import { getRedisConfiguration } from '../../config';
import { ClusterCronCheckerModule, ConfigUtils } from '@XBounty/common';
import { EventsProcessorCron } from './transaction-processor.cron';
import { TransactionProcessorService } from './transaction-processor.service';
import { CacheModule } from '@multiversx/sdk-nestjs-cache';

@Module({
  imports: [
    ClusterCronCheckerModule.register(
      getRedisConfiguration(),
    ),
    CacheModule.forRoot(ConfigUtils.buildRedisOptions(getRedisConfiguration())),
  ],
  providers: [
    TransactionProcessorService,
    EventsProcessorCron,
  ],
})
export class TransactionProcessorModule { }
