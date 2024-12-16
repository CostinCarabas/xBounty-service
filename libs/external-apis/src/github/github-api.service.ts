import { Injectable } from '@nestjs/common';
import { OctokitService } from 'nestjs-octokit';

@Injectable()
export class GithubApiService {
  constructor(
    // private readonly options: GithubApiModuleOptions,
    private readonly octokitService: OctokitService,
  ) { }

  onModuleInit() {
    this.queryRepos();
  }

  async createIssueComment(
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
  ) {
    return this.octokitService.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
  }

  async queryRepos() {
    const response = await this.octokitService.rest.search.repos({
      q: 'nest-js',
    });

    console.log('response :>> ', response);

    return response.data.items;
  }
}
