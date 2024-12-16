import { Module } from '@nestjs/common';
import { CommentCreatedHandlerService } from './comment-created-handler.service';
import { GithubApiModule } from '@XBounty/external-apis';
import { getGithubApiConfiguration } from '../../../../../config';

@Module({
  imports: [
    GithubApiModule.register(getGithubApiConfiguration()),
  ],
  providers: [
    CommentCreatedHandlerService,
  ],
  exports: [
    CommentCreatedHandlerService,
  ],
})
export class CommentCreatedHandlerModule { }
