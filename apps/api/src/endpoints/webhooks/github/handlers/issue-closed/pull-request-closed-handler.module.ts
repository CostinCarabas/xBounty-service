import { Module } from '@nestjs/common';
import { PullRequestClosedHandlerService } from './pull-request-closed-handler.service';
import { ContractInteractorModule } from '@XBounty/core';
import { getContractsConfiguration, getMultiversXApisConfiguration } from '../../../../../config';

@Module({
  imports: [
    ContractInteractorModule.register(
      {
        api: getMultiversXApisConfiguration().api,
        chainId: getMultiversXApisConfiguration().chainId,
        contract: getContractsConfiguration().xBounty,
      },
    ),
  ],
  providers: [
    PullRequestClosedHandlerService,
  ],
  exports: [
    PullRequestClosedHandlerService,
  ],
})
export class PullRequestClosedHandlerModule { }
