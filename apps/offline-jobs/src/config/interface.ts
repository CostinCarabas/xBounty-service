import {
  ApisConfigurationInterface, EnvConfigurationEnum,
  RabbitConfigurationInterface, RedisConfigurationInterface, SqlDatabaseConfigurationInterface,
} from '@XBounty/config';
import {
  CronsConfigurationInterface,
} from './models/crons-configuration.interface';
import { DisabledConsumersConfigurationInterface } from './models/disabled-consumers-configuration.interface';

export interface ConfigurationInterface {
  env: EnvConfigurationEnum;
  port: number;
  serviceName: string;
  sqlDatabase: SqlDatabaseConfigurationInterface;
  redis: RedisConfigurationInterface;
  commonRedis: RedisConfigurationInterface;
  apis: ApisConfigurationInterface;
  rabbit: RabbitConfigurationInterface;
  crons: CronsConfigurationInterface;
  disabledConsumers: DisabledConsumersConfigurationInterface;
}
