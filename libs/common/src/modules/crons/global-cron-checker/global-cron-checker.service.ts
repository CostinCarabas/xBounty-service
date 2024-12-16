import { Inject, Injectable } from '@nestjs/common';
import Ioredis from 'ioredis';
import { Logger } from '../../logger';
import { CronCheckerBaseService } from '../common';

@Injectable()
export class GlobalCronCheckerService extends CronCheckerBaseService {
  constructor(
    @Inject('common') protected readonly redis: Ioredis,
    protected readonly logger: Logger,
  ) {
    super();
  }
}
