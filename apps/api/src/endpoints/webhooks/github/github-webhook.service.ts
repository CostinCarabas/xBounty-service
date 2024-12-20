import { Injectable } from '@nestjs/common';
import { GithubWebhookInput } from './models/github-webhook.input';
import { ActionTypeEnum } from './models/action-type.enum';
import { CommentCreatedHandlerService } from './handlers/comment-created/comment-created-handler.service';
import {
  InstallationCreatedHandlerService,
} from './handlers/installation-created/installation-created-handler.service';
import {
  InstallationDeletedHandlerService,
} from './handlers/installation-deleted/installation-deleted-handler.service';
import { PullRequestClosedHandlerService } from './handlers/issue-closed/pull-request-closed-handler.service';

@Injectable()
export class GithubWebhookService {
  constructor(
    private readonly commentCreatedHandlerService: CommentCreatedHandlerService,
    private readonly installationCreatedHandlerService: InstallationCreatedHandlerService,
    private readonly installationDeletedHandlerService: InstallationDeletedHandlerService,
    private readonly pullRequestClosedHandlerService: PullRequestClosedHandlerService,
  ) { }

  async execute(input: GithubWebhookInput): Promise<void> {
    console.log('input :>> ', input);
    switch (input.action) {
      case ActionTypeEnum.Created:
        return await this.handleTypeCreated(input);
      case ActionTypeEnum.Deleted:
        return await this.handleTypeDeleted(input);
      case ActionTypeEnum.Closed:
        return await this.handleTypeClosed(input);
    }
  }

  private async handleTypeCreated(input: GithubWebhookInput): Promise<void> {
    if ('comment' in input) {
      return await this.commentCreatedHandlerService.execute(input);
    }
    if ('installation' in input) {
      return await this.installationCreatedHandlerService.execute(input);
    }
  }

  private async handleTypeDeleted(input: GithubWebhookInput): Promise<void> {
    if ('installation' in input) {
      return await this.installationDeletedHandlerService.execute(input);
    }
  }

  private async handleTypeClosed(input: GithubWebhookInput): Promise<void> {
    if ('pull_request' in input) {
      return await this.pullRequestClosedHandlerService.execute(input);
    }
  }
}
