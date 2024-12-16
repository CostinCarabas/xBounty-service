import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { GithubWebhookModule } from './github/github-webhook.module';

@Module({
  imports: [
    GithubWebhookModule,
  ],
  controllers: [
    WebhooksController,
  ],
})
export class WebhooksModule { }
