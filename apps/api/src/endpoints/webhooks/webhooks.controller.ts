import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubWebhookService } from './github/github-webhook.service';
import { GithubWebhookInput } from './github/models/github-webhook.input';

@Controller({
  path: 'webhooks',
  version: '1',
})
@ApiTags('Webhooks')
export class WebhooksController {
  constructor(
    private readonly githubWebhookService: GithubWebhookService,
  ) { }

  @Post('github')
  async handleGithubWebhook(
    @Body() input: GithubWebhookInput,
  ): Promise<void> {
    await this.githubWebhookService.execute(input);
  }
}
