export interface SqlDatabaseConfigurationInterface {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectionLimit: number;
  migrations: string[];
  entities: string[];
  subscribers: string[];
  replicas: SqlDatabaseReplicaConfigurationInterface[] | undefined;
}

export interface SqlDatabaseReplicaConfigurationInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
