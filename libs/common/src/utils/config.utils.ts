import {
  RedisCacheModuleOptions,
} from '@multiversx/sdk-nestjs-cache';
import { RabbitConfigurationInterface, RedisConfigurationInterface } from '@XBounty/config';
import { RabbitModuleOptions } from '@multiversx/sdk-nestjs-rabbitmq';

export class ConfigUtils {
  static buildRedisOptions(
    redisConfigurations: RedisConfigurationInterface,
  ): RedisCacheModuleOptions {
    return new RedisCacheModuleOptions({
      host: redisConfigurations.host,
      port: redisConfigurations.port,
      username: redisConfigurations.username,
      password: redisConfigurations.password,
      sentinelUsername: redisConfigurations.sentinelUsername,
      sentinelPassword: redisConfigurations.sentinelPassword,
      sentinels: redisConfigurations.sentinels,
      name: redisConfigurations.name,
      tls: redisConfigurations.tls === true ? {} : undefined,
    });
  }

  static buildRabbitOptions(
    rabbitConfigurations: RabbitConfigurationInterface,
    exchanges: string[],
  ): RabbitModuleOptions {
    return new RabbitModuleOptions(rabbitConfigurations.uri, exchanges,
      {
        timeout: 10000,
      },
      10,
    );
  }
}
