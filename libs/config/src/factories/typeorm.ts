import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SqlDatabaseConfigurationInterface } from '../interfaces';

export const getTypeormOptions = (
  dbConfiguration: SqlDatabaseConfigurationInterface,
): TypeOrmModuleOptions => {
  const db = {
    host: dbConfiguration.host,
    port: dbConfiguration.port,
    username: dbConfiguration.username,
    password: dbConfiguration.password,
    database: dbConfiguration.database,
  };

  const dbReplicas = dbConfiguration.replicas && dbConfiguration.replicas.length > 0 ? dbConfiguration.replicas : [db];

  return {
    autoLoadEntities: true,
    type: 'mysql',
    synchronize: false,
    logging: false,
    dropSchema: false,
    migrationsTableName: 'migrations',
    migrationsRun: false,
    host: dbConfiguration.host,
    port: dbConfiguration.port,
    username: dbConfiguration.username,
    password: dbConfiguration.password,
    database: dbConfiguration.database,
    replication: {
      master: db,
      slaves: dbReplicas,
      restoreNodeTimeout: 5000,
      canRetry: true,
    },
    extra: {
      connectionLimit: dbConfiguration.connectionLimit,
    },
    entities: dbConfiguration.entities,
    migrations: dbConfiguration.migrations,
    subscribers: dbConfiguration.subscribers,
  };
};
