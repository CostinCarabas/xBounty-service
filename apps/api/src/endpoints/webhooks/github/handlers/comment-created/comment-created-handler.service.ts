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
    console.log('input :>> ', input);
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const body = 'Hello, World!';
    const installationId = input.installation.id;
    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      issueNumber,
      body,
    );
  }
}
