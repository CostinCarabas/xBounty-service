import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigApiService } from '@XBounty/config';
import { CronJobBase, GlobalCronCheckerService } from '@XBounty/common';

@Injectable()
export class GlobalCron extends CronJobBase {
  protected configKey = 'crons.globalCron';
  protected cronTime = CronExpression.EVERY_MINUTE;
  protected ttl = 30;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configApiService: ConfigApiService,
    protected readonly globalCronCheckerService: GlobalCronCheckerService,
  ) {
    super(schedulerRegistry, configApiService, globalCronCheckerService);
  }

  async execute(): Promise<void> {
    console.log('This cron runs in one cluster!');
  }
}
