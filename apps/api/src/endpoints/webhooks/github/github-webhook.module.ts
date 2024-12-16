import { Module } from '@nestjs/common';
import { GithubWebhookService } from './github-webhook.service';
import { CommentCreatedHandlerModule } from './handlers/comment-created/comment-created-handler.module';
import { InstallationCreatedHandlerModule } from './handlers/installation-created/installation-created-handler.module';

import { InstallationDeletedHandlerModule } from './handlers/installation-deleted/installation-deleted-handler.module';

@Module({
  imports: [
    CommentCreatedHandlerModule,
    InstallationCreatedHandlerModule,
    InstallationDeletedHandlerModule,
  ],
  providers: [
    GithubWebhookService,
  ],
  exports: [
    GithubWebhookService,
  ],
})
export class GithubWebhookModule { }
