import { Inject, Injectable } from '@nestjs/common';
import Ioredis from 'ioredis';
import { Logger } from '../../logger';
import { CronCheckerBaseService } from '../common';

@Injectable()
export class ClusterCronCheckerService extends CronCheckerBaseService {
  constructor(
    @Inject('default') protected readonly redis: Ioredis,
    protected readonly logger: Logger,
  ) {
    super();
  }
}
