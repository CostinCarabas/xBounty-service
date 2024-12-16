import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigApiService } from '@XBounty/config';
import { ClusterCronCheckerService, CronJobBase, TimeConstants } from '@XBounty/common';
import { TransactionProcessorService } from './transaction-processor.service';
import { Lock } from "@multiversx/sdk-nestjs-common";

@Injectable()
export class EventsProcessorCron extends CronJobBase {
  protected configKey = 'crons.transactionProcessor';
  protected cronTime = CronExpression.EVERY_SECOND;
  protected ttl = TimeConstants.oneSecond;

  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly configApiService: ConfigApiService,
    protected readonly clusterCronCheckerService: ClusterCronCheckerService,
    private readonly transactionProcessorService: TransactionProcessorService,
  ) {
    super(schedulerRegistry, configApiService, clusterCronCheckerService);
  }

  @Lock({ name: "newTransactions", verbose: true })
  async execute(): Promise<void> {
    await this.transactionProcessorService.execute();
  }
}