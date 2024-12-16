import { Module } from '@nestjs/common';
import { getRedisConfiguration } from '../../config';
import { GlobalCron } from './global.cron';
import { GlobalCronCheckerModule } from '@XBounty/common';

@Module({
  imports: [
    GlobalCronCheckerModule.register(
      getRedisConfiguration(),
    ),
  ],
  providers: [
    GlobalCron,
  ],
})
export class GlobalModule { }
