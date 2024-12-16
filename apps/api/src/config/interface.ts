import {
  ApisConfigurationInterface, ContractsConfigurationInterface, EnvConfigurationEnum,
  NativeAuthConfigurationInterface,
  RabbitConfigurationInterface, RedisConfigurationInterface, SqlDatabaseConfigurationInterface,
} from '@XBounty/config';

export interface ConfigurationInterface {
  env: EnvConfigurationEnum;
  keepAliveTimeoutUpstream: number;
  port: number;
  serviceName: string;
  prefix: string;
  sqlDatabase: SqlDatabaseConfigurationInterface;
  redis: RedisConfigurationInterface;
  commonRedis: RedisConfigurationInterface;
  apis: ApisConfigurationInterface;
  rabbit: RabbitConfigurationInterface;
  nativeAuth: NativeAuthConfigurationInterface;
  contracts: ContractsConfigurationInterface;
}
