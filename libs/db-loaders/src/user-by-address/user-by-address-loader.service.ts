import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { Injectable } from '@nestjs/common';
import { TimeConstants } from '@XBounty/common';
import { UserEntity, UserEntityRepository } from '@XBounty/db';

@Injectable()
export class UserByAddressLoaderService {
  constructor(
    private readonly userEntityRepository: UserEntityRepository,
    private readonly cacheService: CacheService,
  ) { }

  async load(address: string): Promise<UserEntity | null> {
    return await this.cacheService.getOrSet(
      this.getCacheKey(address),
      () => this.userEntityRepository.findByAddress(address),
      TimeConstants.oneMinute * 10,
      TimeConstants.oneMinute,
      false,
    );
  }

  private getCacheKey(address: string): string {
    return `${UserByAddressLoaderService.name}.address:${address}`;
  }
}
