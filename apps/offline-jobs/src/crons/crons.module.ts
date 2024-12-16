import { Module } from '@nestjs/common';
import { EachClusterModule } from './each-cluster/each-cluster.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    EachClusterModule,
    GlobalModule,
  ],
})
export class CronsModule { }
