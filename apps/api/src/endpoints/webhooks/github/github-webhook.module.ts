import { Module } from '@nestjs/common';
import { GithubWebhookService } from './github-webhook.service';
import { CommentCreatedHandlerModule } from './handlers/comment-created/comment-created-handler.module';
import { InstallationCreatedHandlerModule } from './handlers/installation-created/installation-created-handler.module';

@Module({
  imports: [
    CommentCreatedHandlerModule,
    InstallationCreatedHandlerModule,
  ],
  providers: [
    GithubWebhookService,
  ],
  exports: [
    GithubWebhookService,
  ],
})
export class GithubWebhookModule { }
