import Ioredis from 'ioredis';
import { ErrorsUtils } from '../../../utils';
import { Logger } from '../../logger';

export abstract class CronCheckerBaseService {
  protected abstract readonly redis: Ioredis;
  protected abstract readonly logger: Logger;

  async lock(
    configKey: string,
    ttl: number,
    promise: () => Promise<void>,
  ): Promise<void> {
    const lockAcquired = await this.tryLock(configKey, ttl);
    if (!lockAcquired) {
      return;
    }

    try {
      await promise();
    } catch (error) {
      this.logger.error('An error occurred while running cron job.', {
        configKey,
        error: ErrorsUtils.getError(error),
      });
    }
  }

  private async tryLock(
    configKey: string,
    ttl: number,
  ): Promise<boolean> {
    const lockAcquired = await this.setnx(configKey, 'true', ttl);
    return lockAcquired;
  }

  private async setnx<T>(
    key: string,
    value: T,
    ttl: number,
  ): Promise<boolean> {
    const result = await this.redis.set(key, JSON.stringify(value), 'EX', ttl, 'NX');
    return result === 'OK';
  }
}
