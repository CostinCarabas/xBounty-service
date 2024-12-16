import { Module } from '@nestjs/common';
import { EachClusterModule } from './each-cluster/each-cluster.module';
import { GlobalModule } from './global/global.module';
import { TransactionProcessorModule } from './transaction-processor/transaction-processor.module';

@Module({
  imports: [
    EachClusterModule,
    GlobalModule,
    TransactionProcessorModule,
  ],
})
export class CronsModule { }
