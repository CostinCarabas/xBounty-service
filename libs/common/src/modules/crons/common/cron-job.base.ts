import { OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigApiService } from '@XBounty/config';
import { CronJob } from 'cron';
import { CronCheckerBaseService } from './cron-checker-base.service';

export abstract class CronJobBase implements OnModuleInit {
  protected abstract configKey: string;
  protected abstract cronTime: string;
  protected abstract ttl: number;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configApiService: ConfigApiService,
    protected readonly cronCheckerBaseService: CronCheckerBaseService,
  ) { }

  onModuleInit(): void {
    this.configCronJob();
  }

  private configCronJob(): void {
    if (!this.isEnabled(this.configKey)) {
      return;
    }

    const cronJob = new CronJob(this.cronTime,
      async () => {
        await this.cronCheckerBaseService.lock(
          this.configKey,
          this.ttl,
          async () => await this.execute(),
        );
      });
    this.schedulerRegistry.addCronJob(this.configKey, cronJob);
    cronJob.start();
  }

  private isEnabled(configKey: string): boolean {
    return this.configApiService.getOrDefault<boolean>(configKey, false);
  }

  abstract execute(): Promise<void>;
}
