import { Module } from '@nestjs/common';
import { CommentCreatedHandlerService } from './comment-created-handler.service';
import { GithubApiModule } from '@XBounty/external-apis';
import { getApisConfiguration, getContractsConfiguration, getGithubApiConfiguration } from '../../../../../config';
import { TransactionGeneratorModule } from '@XBounty/core';

@Module({
  imports: [
    GithubApiModule.register(getGithubApiConfiguration()),
    TransactionGeneratorModule.register(
      {
        contract: getContractsConfiguration().xBounty,
        walletUrl: getApisConfiguration().multiversx.wallet,
      },
    ),
  ],
  providers: [
    CommentCreatedHandlerService,
  ],
  exports: [
    CommentCreatedHandlerService,
  ],
})
export class CommentCreatedHandlerModule { }
