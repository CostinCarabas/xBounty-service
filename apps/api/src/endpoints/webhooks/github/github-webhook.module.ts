import { Module } from '@nestjs/common';
import { GithubWebhookService } from './github-webhook.service';
import { CommentCreatedHandlerModule } from './handlers/comment-created/comment-created-handler.module';
import { InstallationCreatedHandlerModule } from './handlers/installation-created/installation-created-handler.module';

import { InstallationDeletedHandlerModule } from './handlers/installation-deleted/installation-deleted-handler.module';
import { PullRequestClosedHandlerModule } from './handlers/issue-closed/pull-request-closed-handler.module';

@Module({
  imports: [
    CommentCreatedHandlerModule,
    InstallationCreatedHandlerModule,
    InstallationDeletedHandlerModule,
    PullRequestClosedHandlerModule,
  ],
  providers: [
    GithubWebhookService,
  ],
  exports: [
    GithubWebhookService,
  ],
})
export class GithubWebhookModule { }
