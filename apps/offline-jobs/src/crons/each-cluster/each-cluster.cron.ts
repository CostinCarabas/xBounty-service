import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigApiService } from '@XBounty/config';
import { ClusterCronCheckerService, CronJobBase } from '@XBounty/common';

@Injectable()
export class EachClusterCron extends CronJobBase {
  protected configKey = 'crons.eachClusterCron';
  protected cronTime = CronExpression.EVERY_MINUTE;
  protected ttl = 30;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configApiService: ConfigApiService,
    protected readonly clusterCronCheckerService: ClusterCronCheckerService,
  ) {
    super(schedulerRegistry, configApiService, clusterCronCheckerService);
  }

  async execute(): Promise<void> {
    console.log('This cron runs on each cluster!');
  }
}
