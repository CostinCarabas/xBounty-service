import { Module } from '@nestjs/common';
import { getRedisConfiguration } from '../../config';
import { EachClusterCron } from './each-cluster.cron';
import { ClusterCronCheckerModule } from '@XBounty/common';

@Module({
  imports: [
    ClusterCronCheckerModule.register(
      getRedisConfiguration(),
    ),
  ],
  providers: [
    EachClusterCron,
  ],
})
export class EachClusterModule { }
