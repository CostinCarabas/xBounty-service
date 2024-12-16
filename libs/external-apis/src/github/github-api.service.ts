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
    installationId: number,
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
  ) {
    const accessToken = await this.getAccessToken(installationId);
    const response = await this.httpService.post(
      `repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {
        body,
      },
      {
        baseURL: 'https://api.github.com',
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    return response.data;
  }

  // async queryRepos() {
  //   const response = await this.octokitService.rest.search.repos({
  //     q: 'nest-js',
  //   });

  //   console.log('response :>> ', response);

  //   return response.data.items;
  // }
}
