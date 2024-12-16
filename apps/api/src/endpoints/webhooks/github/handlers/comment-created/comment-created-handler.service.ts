import { Injectable } from '@nestjs/common';
import { GithubApiService } from '@XBounty/external-apis';
import { GithubWebhookInput } from '../../models/github-webhook.input';
import { FundTxInfo } from './fund-tx-info';
import { TransactionGeneratorService } from '@XBounty/core';
import { RegisterTxInfo } from './register-tx-info';

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
      // the issue comment should be ignored - it is not related to xbounty
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
        await this.handleFund(input, {
          amount: parts[2],
        });
        return true;
      case 'register':
        // if (parts.length < 2) { // uncomment when new params will be added
        //   return false;
        // }
        await this.handleRegister(input, {
          githubUser: input.sender.login,
        });
        return true;
      default:
        return false;
    }
  }

  private async handleRegister(
    input: GithubWebhookInput,
    registerTx: RegisterTxInfo,
  ): Promise<void> {
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const installationId = input.installation.id;

    const txToBeSigned = await this.transactionGeneratorService.executeRegisterTx(
      registerTx.githubUser,
      owner,
      repo,
      issueNumber,
    );

    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      issueNumber,
      `Please sign the following transaction in order to register as a bounty hunter ${txToBeSigned}`,
    );
  }

  private async handleFund(
    input: GithubWebhookInput,
    fundTx: FundTxInfo,
  ): Promise<void> {
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const issueNumber = input.issue.number;
    const installationId = input.installation.id;

    const txToBeSigned = await this.transactionGeneratorService.executeFundTx(
      fundTx.amount,
      owner,
      repo,
      issueNumber,
    );
    if (txToBeSigned == null) {
      await this.githubApiService.createIssueComment(
        installationId,
        owner,
        repo,
        issueNumber,
        'Failed to generate funding transaction. Try again later.',
      );
      return;
    }

    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      issueNumber,
      `Please sign the following transaction in order to fund this issue ${txToBeSigned}`,
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
