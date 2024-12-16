import { Module } from '@nestjs/common';
import { ConfigUtils } from '@XBounty/common';
import { AppInstallationsModule } from '@XBounty/core';
import { getRedisConfiguration } from '../../../../../config';
import { InstallationDeletedHandlerService } from './installation-deleted-handler.service';

@Module({
  imports: [
    AppInstallationsModule.register(
      ConfigUtils.buildRedisOptions(getRedisConfiguration()),
    ),
  ],
  providers: [
    InstallationDeletedHandlerService,
  ],
  exports: [
    InstallationDeletedHandlerService,
  ],
})
export class InstallationDeletedHandlerModule { }
