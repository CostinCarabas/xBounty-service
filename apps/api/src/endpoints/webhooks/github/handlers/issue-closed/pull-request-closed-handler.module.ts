import { Module } from '@nestjs/common';
import { PullRequestClosedHandlerService } from './pull-request-closed-handler.service';
import { ContractInteractorModule, TransactionGeneratorModule } from '@XBounty/core';
import {
  getApisConfiguration,
  getContractsConfiguration, getGithubApiConfiguration, getMultiversXApisConfiguration,
} from '../../../../../config';
import { GithubApiModule } from '@XBounty/external-apis';

@Module({
  imports: [
    ContractInteractorModule.register(
      {
        api: getMultiversXApisConfiguration().api,
        chainId: getMultiversXApisConfiguration().chainId,
        contract: getContractsConfiguration().xBounty,
      },
    ),
    GithubApiModule.register(
      getGithubApiConfiguration(),
    ),
    TransactionGeneratorModule.register(
      {
        contract: getContractsConfiguration().xBounty,
        walletUrl: getApisConfiguration().multiversx.wallet,
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
