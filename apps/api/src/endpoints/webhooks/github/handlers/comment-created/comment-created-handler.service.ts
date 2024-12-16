import { Injectable } from '@nestjs/common';
import { GithubApiService } from '@XBounty/external-apis';
import { GithubWebhookInput } from '../../models/github-webhook.input';
import { FundTxInfo } from './fund-tx-info';
import { TransactionGeneratorService } from '@XBounty/core';

@Injectable()
export class CommentCreatedHandlerService {
  constructor(
    private readonly githubApiService: GithubApiService,
    private readonly transactionGeneratorService: TransactionGeneratorService,
  ) { }

  async execute(
    input: GithubWebhookInput,
  ): Promise<void> {
    const isSuccess = await this.executeInternal(input);
    if (!isSuccess) {
      await this.handleFail(input);
    }
  }

  private async executeInternal(
    input: GithubWebhookInput,
  ): Promise<boolean> {
    const body = input.comment.body;
    if (body == null || !body.toLowerCase().startsWith('@xbounty')) {
      // should be ignored
      return true;
    }

    const parts = body.split(' ');
    if (parts.length < 2) {
      return false;
    }

    const action = parts[1].toLowerCase();

    switch (action) {
      case 'fund':
        if (parts.length < 3) {
          return false;
        }
        const txInfo = {
          amount: parts[2],
          repo: input.repository.name,
          issueNumber: input.issue.number,
        };
        await this.handleFund(input, txInfo);
        return true;
      default:
        return false;
    }
  }

  private async handleFund(
    input: GithubWebhookInput,
    parsedBody: FundTxInfo,
  ): Promise<void> {
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const installationId = input.installation.id;

    const qrCode = await this.transactionGeneratorService.execute(
      parsedBody.amount,
      repo,
      issueNumber,
    );
    if (qrCode == null) {
      await this.githubApiService.createIssueComment(
        installationId,
        owner,
        repo,
        issueNumber,
        'Failed to generate QR code',
      );
      return;
    }

    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      issueNumber,
      qrCode,
    );
  }

  private async handleFail(
    input: GithubWebhookInput,
  ): Promise<void> {
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const installationId = input.installation.id;
    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      issueNumber,
      'Failed to parse the command. Expected format: `@xbounty fund <amount>`',
    );
  }
}
