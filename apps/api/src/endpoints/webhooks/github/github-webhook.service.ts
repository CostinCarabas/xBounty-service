import { Injectable } from '@nestjs/common';
import { GithubWebhookInput } from './models/github-webhook.input';
import { ActionTypeEnum } from './models/action-type.enum';
import { CommentCreatedHandlerService } from './handlers/comment-created/comment-created-handler.service';

@Injectable()
export class GithubWebhookService {
  constructor(
    private readonly commentCreatedHandlerService: CommentCreatedHandlerService,
  ) { }

  async execute(input: GithubWebhookInput): Promise<void> {
    console.log('input :>> ', input);
    switch (input.action) {
      case ActionTypeEnum.Created:
        return await this.handleTypeCreated(input);
    }
  }

  private async handleTypeCreated(input: GithubWebhookInput): Promise<void> {
    if ('comment' in input) {
      return await this.commentCreatedHandlerService.execute(input);
    }
  }
}
