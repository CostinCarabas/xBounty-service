import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { Injectable } from '@nestjs/common';
import { TimeConstants } from '@XBounty/common';

@Injectable()
export class AppInstallationsService {
  constructor(
    private readonly cacheService: CacheService,
  ) { }

  async setInstallation(
    owner: string,
    repo: string,
    installationId: number,
  ): Promise<void> {
    const key = this.getCacheKey(owner, repo);
    await this.cacheService.set(key, installationId, TimeConstants.oneWeek * 55);
  }

  async getInstallation(
    owner: string,
    repo: string,
  ): Promise<number | undefined> {
    const key = this.getCacheKey(owner, repo);
    return this.cacheService.get<number>(key);
  }

  async removeInstallation(
    owner: string,
    repo: string,
  ): Promise<void> {
    const key = this.getCacheKey(owner, repo);
    await this.cacheService.delete(key);
  }

  private getCacheKey(
    owner: string,
    repo: string,
  ): string {
    return `${AppInstallationsService.name}_owner:${owner}_repo:${repo}`;
  }
}
