import { Inject, Injectable } from '@nestjs/common';
import { ConfigApiService } from '@XBounty/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { LogConfig } from './config';

@Injectable()
export class Logger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly configApiService: ConfigApiService,
  ) { }

  debug(
    message: string,
    params: Record<string, unknown> = {},
  ): void {
    this.logger.debug(message, {
      ...this.getCommonLogInfo(),
      ...params,
    });
  }

  info(
    message: string,
    params: Record<string, unknown> = {},
  ): void {
    this.logger.info(message, {
      ...this.getCommonLogInfo(),
      ...params,
    });
  }

  error(
    message: string,
    params: Record<string, unknown> = {},
  ): void {
    this.logger.error(message, {
      ...this.getCommonLogInfo(),
      ...params,
    });
  }

  warn(
    message: string,
    params: Record<string, unknown> = {},
  ): void {
    this.logger.warn(message, {
      ...this.getCommonLogInfo(),
      ...params,
    });
  }

  private getCommonLogInfo(): LogConfig {
    return {
      serviceName: this.configApiService.getServiceName(),
    };
  }
}
