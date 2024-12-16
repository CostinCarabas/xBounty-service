import { Injectable } from '@nestjs/common';
import { GithubApiService } from '@XBounty/external-apis';
import { GithubWebhookInput } from '../../models/github-webhook.input';

@Injectable()
export class CommentCreatedHandlerService {
  constructor(
    private readonly githubApiService: GithubApiService,
  ) { }

  async execute(
    input: GithubWebhookInput,
  ): Promise<void> {
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const body = 'Hello, World!';
    await this.githubApiService.createIssueComment(
      owner,
      repo,
      issueNumber,
      body,
    );
  }
}
