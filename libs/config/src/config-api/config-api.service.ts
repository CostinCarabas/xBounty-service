import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigurationEnum } from '../enums';

@Injectable()
export class ConfigApiService {
  constructor(private readonly configService: ConfigService) { }

  getEnv(): EnvConfigurationEnum {
    return this.getOrFail<EnvConfigurationEnum>('env');
  }

  getServiceName(): string {
    return this.getOrDefault('serviceName', '');
  }

  getOrFail<T>(configKey: string): T {
    const config = this.configService.get<T>(configKey);
    if (!config) {
      throw new Error(`No configuration found for key ${configKey}.`);
    }
    return config;
  }

  getOrDefault<T>(
    configKey: string,
    defaultValue: T,
  ): T {
    const config = this.configService.get<T>(configKey);
    return config ?? defaultValue;
  }
}
