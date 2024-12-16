import { Injectable } from '@nestjs/common';
import { GithubApiModuleOptions } from './options';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@XBounty/http';
import { AccessTokenInfo } from './models/access-token-info';

@Injectable()
export class GithubApiService {
  constructor(
    private readonly options: GithubApiModuleOptions,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) { }

  // onModuleInit() {
  //   this.getAccessToken(1);
  // }

  async generateJwt() {
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 600,
      iss: this.options.clientId,
    };

    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.options.privateKey,
    });
  }

  async getAccessToken(installationId: number): Promise<string | undefined> {
    const jwt = await this.generateJwt();

    try {
      const response = await this.httpService.post<Record<never, never>, AccessTokenInfo>(
        `app/installations/${installationId}/access_tokens`,
        {},
        {
          baseURL: 'https://api.github.com',
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      return response?.data?.token; // Access token
    } catch (error) {
      console.error('error :>> ', error);
      return;
    }
  }

  async createIssueComment(
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
  ) {
    console.log('owner :>> ', owner);
    console.log('repo :>> ', repo);
    console.log('issueNumber :>> ', issueNumber);
    console.log('body :>> ', body);
    // return this.octokitService.rest.issues.createComment({
    //   owner,
    //   repo,
    //   issue_number: issueNumber,
    //   body,
    // });
  }

  // async queryRepos() {
  //   const response = await this.octokitService.rest.search.repos({
  //     q: 'nest-js',
  //   });

  //   console.log('response :>> ', response);

  //   return response.data.items;
  // }
}
