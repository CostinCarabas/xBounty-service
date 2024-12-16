import {
  ApisConfigurationInterface, EnvConfigurationEnum,
  GithubApiConfigurationInterface,
  MultiversXApisConfigurationInterface, RabbitConfigurationInterface, RedisConfigurationInterface,
  SqlDatabaseConfigurationInterface,
} from '@XBounty/config';
import { join } from 'path';
import { ConfigurationInterface } from './interface';
import { CronsConfigurationInterface } from './models/crons-configuration.interface';
import { DisabledConsumersConfigurationInterface } from './models/disabled-consumers-configuration.interface';
import { ConfigurationLoader, ConfigurationLoaderSettings } from '@multiversx/sdk-nestjs-common';

const YAML_CONFIG_FILENAME = 'config.yaml';
const CONFIG_SCHEMA_FILENAME = 'schema.yaml';

export function configFactory(): ConfigurationInterface {
  const configPath = join(__dirname, YAML_CONFIG_FILENAME);
  const schemaPath = join(__dirname, CONFIG_SCHEMA_FILENAME);

  const settings = new ConfigurationLoaderSettings({
    configPath,
    schemaPath,
  });

  return ConfigurationLoader.getConfiguration<ConfigurationInterface>(settings);
}

export default configFactory;

export const getEnv = (): EnvConfigurationEnum => {
  return configFactory().env;
};

export const getRabbitConfiguration = (): RabbitConfigurationInterface => {
  return configFactory().rabbit;
};

export const getRedisConfiguration = (): RedisConfigurationInterface => {
  return configFactory().redis;
};

export const getCommonRedisConfiguration = (): RedisConfigurationInterface => {
  return configFactory().commonRedis;
};

export const getSqlDatabaseConfiguration = (): SqlDatabaseConfigurationInterface => {
  return configFactory().sqlDatabase;
};

export const getApisConfiguration = (): ApisConfigurationInterface => {
  return configFactory().apis;
};

export const getMultiversXApisConfiguration = (): MultiversXApisConfigurationInterface => {
  return getApisConfiguration().multiversx;
};

export const getCronsConfiguration = (): CronsConfigurationInterface => {
  return configFactory().crons;
};

export const getDisabledConsumersConfiguration = (): DisabledConsumersConfigurationInterface => {
  return configFactory().disabledConsumers;
};

export const getGithubApiConfiguration = (): GithubApiConfigurationInterface => {
  return getApisConfiguration().github;
};
