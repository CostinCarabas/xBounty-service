import { Injectable } from '@nestjs/common';
import { AppInstallationsService } from '@XBounty/core';
import { GithubWebhookInput } from '../../models/github-webhook.input';

@Injectable()
export class InstallationDeletedHandlerService {
  constructor(
    private readonly appInstallationsService: AppInstallationsService,
  ) { }

  async execute(
    input: GithubWebhookInput,
  ): Promise<void> {
    const owner = input.installation.account?.login;
    if (owner == null) {
      return;
    }

    const repositories = input.repositories.map((repo) => ({
      name: repo.name,
    }));

    for (const repo of repositories) {
      await this.appInstallationsService.removeInstallation(
        owner,
        repo.name,
      );
    }
  }
}
