import { Module } from '@nestjs/common';
import { CommentCreatedHandlerService } from './comment-created-handler.service';
import { GithubApiModule } from '@XBounty/external-apis';
import { getContractsConfiguration, getGithubApiConfiguration } from '../../../../../config';
import { TransactionGeneratorModule } from '@XBounty/core';

@Module({
  imports: [
    GithubApiModule.register(getGithubApiConfiguration()),
    TransactionGeneratorModule.register(
      {
        contract: getContractsConfiguration().xBounty,
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
