import { Injectable } from '@nestjs/common';
import { GithubWebhookInput } from '../../models/github-webhook.input';
import { ContractInteractorService } from '@XBounty/core';

@Injectable()
export class PullRequestClosedHandlerService {
  constructor(
    private readonly contractInteractorService: ContractInteractorService,
  ) { }

  // async onModuleInit() {
  //   const res = await this.contractInteractorService.getBounty({
  //     repoOwner: 'GuticaStefan',
  //     repoUrl: 'MultiversX-Exchange-Testing-Project',
  //     issueId: 1,
  //   });
  //   console.log('res :>> ', res);
  // }

  async execute(
    input: GithubWebhookInput,
  ): Promise<void> {
    const relatedIssue = this.extractRelatedIssue(input);
    if (relatedIssue == null) {
      return;
    }

    const installationId = input.installation.id;
    const owner = input.repository.owner.login;
    const repo = input.repository.name;

    console.log('installationId :>> ', installationId);
    console.log('owner :>> ', owner);
    console.log('repo :>> ', repo);
    console.log('relatedIssue :>> ', relatedIssue);

    await this.queryIssue(owner, repo, relatedIssue);
  }

  private async queryIssue(
    owner: string,
    repo: string,
    issueNumber: number,
  ): Promise<void> {
    const response = await this.contractInteractorService.getBounty({
      issueId: issueNumber,
      repoOwner: owner,
      repoUrl: repo,
    });
    console.log('response :>> ', response);
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
