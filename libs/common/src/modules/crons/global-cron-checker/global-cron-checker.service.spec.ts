import { Test } from '@nestjs/testing';
import { GlobalCronCheckerService } from './global-cron-checker.service';
import Ioredis from 'ioredis';
import { Logger } from '../../logger';

describe('GlobalCronCheckerService', () => {
  let globalCronCheckerService: GlobalCronCheckerService;
  let mockRedis: Ioredis;
  let mockLogger: Logger;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GlobalCronCheckerService,
        {
          provide: 'common',
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

    mockRedis = module.get<Ioredis>('common');
    mockLogger = module.get<Logger>(Logger);
    globalCronCheckerService = module.get<GlobalCronCheckerService>(GlobalCronCheckerService);
    jest.spyOn(mockLogger, 'error').mockImplementation(() => { return mockLogger; });
  });

  it('lock - set returns 0 - does not execute', async () => {
    // Arrange.
    jest.spyOn(mockRedis, 'set').mockReturnValue(Promise.resolve(null));

    // Act.
    let executed = false;
    await globalCronCheckerService.lock('configKey', 300, async () => {
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
    await globalCronCheckerService.lock('configKey', 300, async () => {
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
    await globalCronCheckerService.lock('configKey', 300, async () => {
      executed = true;
      throw new Error('test');
    });

    // Assert.
    expect(executed).toBe(true);
    expect(mockRedis.set).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
