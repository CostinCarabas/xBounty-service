import { Injectable } from '@nestjs/common';
import { GithubWebhookInput } from '../../models/github-webhook.input';
import { BountyInfo, ContractInteractorService, TransactionGeneratorService } from '@XBounty/core';
import { GithubApiService } from '@XBounty/external-apis';

@Injectable()
export class PullRequestClosedHandlerService {
  constructor(
    private readonly contractInteractorService: ContractInteractorService,
    private readonly transactionGeneratorService: TransactionGeneratorService,
    private readonly githubApiService: GithubApiService,
  ) { }

  async execute(
    input: GithubWebhookInput,
  ): Promise<void> {
    const relatedIssueNumber = this.extractRelatedIssue(input);
    if (relatedIssueNumber == null) {
      return;
    }

    const installationId = input.installation.id;
    const owner = input.repository.owner.login;
    const repo = input.repository.name;
    const solver = input.pull_request.user.login;

    console.log('installationId :>> ', installationId);
    console.log('owner :>> ', owner);
    console.log('repo :>> ', repo);
    console.log('solver :>> ', solver);
    console.log('relatedIssue :>> ', relatedIssueNumber);

    const bounty = await this.queryGetBounty(owner, repo, relatedIssueNumber);
    if (bounty == null) {
      return;
    }

    console.log('bounty :>> ', bounty);

    if (bounty.status.name !== 'Registered') {
      console.log('Bounty is not registered', bounty);
      return;
    }

    const solverInfo = bounty.solvers.find(s => s.solver_github === solver);
    if (solverInfo == null) {
      console.log('Solver not found in bounty', bounty, solver);
      return;
    }

    const txToBeSigned = await this.transactionGeneratorService.executeReleaseBountyTx(
      owner, repo, relatedIssueNumber, solverInfo.solver_addr, solverInfo.solver_github,
    );
    if (txToBeSigned == null) {
      console.log('Failed to generate release bounty tx', bounty, solverInfo);
      return;
    }

    await this.githubApiService.createIssueComment(
      installationId,
      owner,
      repo,
      relatedIssueNumber,
      'Please sign the following transaction in order to release the bounty' +
      `to @${solverInfo.solver_github}: ${txToBeSigned}`,
    );
  }

  private async queryGetBounty(
    owner: string,
    repo: string,
    issueNumber: number,
  ): Promise<BountyInfo | undefined> {
    const bounty = await this.contractInteractorService.getBounty({
      issueId: issueNumber,
      repoOwner: owner,
      repoUrl: repo,
    });
    if (bounty == null) {
      return;
    }

    return bounty;
  }

  private extractRelatedIssue(
    input: GithubWebhookInput,
  ): number | undefined {
    const prBody = input.pull_request.body;
    if (prBody == null) {
      return;
    }

    const issueIdentifier: string | undefined = prBody.match(/#\d+/)?.[0];
    if (issueIdentifier == null) {
      return;
    }

    const issueNumber = parseInt(issueIdentifier.replace('#', ''));
    return issueNumber;
  }
}
