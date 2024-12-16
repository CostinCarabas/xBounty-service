import { Module } from '@nestjs/common';
import { ConfigUtils } from '@XBounty/common';
import { AppInstallationsModule } from '@XBounty/core';
import { getRedisConfiguration } from '../../../../../config';
import { InstallationCreatedHandlerService } from './installation-created-handler.service';

@Module({
  imports: [
    AppInstallationsModule.register(
      ConfigUtils.buildRedisOptions(getRedisConfiguration()),
    ),
  ],
  providers: [
    InstallationCreatedHandlerService,
  ],
  exports: [
    InstallationCreatedHandlerService,
  ],
})
export class InstallationCreatedHandlerModule { }
