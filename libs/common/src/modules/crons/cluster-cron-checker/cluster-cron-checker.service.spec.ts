import { Test } from '@nestjs/testing';
import { ClusterCronCheckerService } from './cluster-cron-checker.service';
import Ioredis from 'ioredis';
import { Logger } from '../../logger';

describe('ClusterCronCheckerService', () => {
  let clusterCronCheckerService: ClusterCronCheckerService;
  let mockRedis: Ioredis;
  let mockLogger: Logger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClusterCronCheckerService,
        {
          provide: 'default',
          useValue: {
            set(): void {
              return;
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            error() { return; },
          },
        },
      ],
    }).compile();

    mockRedis = module.get<Ioredis>('default');
    mockLogger = module.get<Logger>(Logger);
    clusterCronCheckerService = module.get<ClusterCronCheckerService>(ClusterCronCheckerService);
    jest.spyOn(mockLogger, 'error').mockImplementation(() => { return mockLogger; });
  });

  it('lock - set returns null - does not execute', async () => {
    // Arrange.
    jest.spyOn(mockRedis, 'set').mockReturnValue(Promise.resolve(null));

    // Act.
    let executed = false;
    await clusterCronCheckerService.lock('configKey', 300, async () => {
      executed = true;
    });

    // Assert.
    expect(executed).toBe(false);
    expect(mockRedis.set).toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('lock - set returns 1 - executes', async () => {
    // Arrange.
    jest.spyOn(mockRedis, 'set').mockReturnValue(Promise.resolve('OK'));

    // Act.
    let executed = false;
    await clusterCronCheckerService.lock('configKey', 300, async () => {
      executed = true;
    });

    // Assert.
    expect(executed).toBe(true);
    expect(mockRedis.set).toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('lock - lockTryOnce returns 1 - throws error - logger is called', async () => {
    // Arrange.
    jest.spyOn(mockRedis, 'set').mockReturnValue(Promise.resolve('OK'));

    // Act.
    let executed = false;
    await clusterCronCheckerService.lock('configKey', 300, async () => {
      executed = true;
      throw new Error('test');
    });

    // Assert.
    expect(executed).toBe(true);
    expect(mockRedis.set).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
