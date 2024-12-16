import { Injectable } from '@nestjs/common';
import { GithubApiModuleOptions } from './options';
import { JwtService } from '@nestjs/jwt';
import {
  defaultDownstreamKeepAliveTimeout, getHttpAgent, getHttpsAgent, HttpService,
} from '@XBounty/http';
import { AccessTokenInfo } from './models/access-token-info';
import { ErrorsUtils, Logger, TimeConstants } from '@XBounty/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class GithubApiService {
  private readonly httpAgent = getHttpAgent(defaultDownstreamKeepAliveTimeout);
  private readonly httpsAgent = getHttpsAgent(defaultDownstreamKeepAliveTimeout);

  constructor(
    private readonly options: GithubApiModuleOptions,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) { }

  private getConfig = (): AxiosRequestConfig => {
    return {
      baseURL: this.options.url,
      httpAgent: this.httpAgent,
      httpsAgent: this.httpsAgent,
      timeout: 5000,
    };
  };

  async generateJwt() {
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TimeConstants.oneMinute * 5,
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
          ...this.getConfig(),
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      return response?.data?.token; // Access token
    } catch (error) {
      this.logger.error('Failed to get access token', {
        error: ErrorsUtils.getError(error),
      });
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
    try {
      const accessToken = await this.getAccessToken(installationId);
      const response = await this.httpService.post(
        `repos/${owner}/${repo}/issues/${issueNumber}/comments`,
        {
          body,
        },
        {
          ...this.getConfig(),
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to create issue comment', {
        error: ErrorsUtils.getError(error),
      });
      return;
    }
  }
}
