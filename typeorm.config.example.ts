import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3324,
  username: 'root',
  password: 'root',
  database: 'x-bounty-app-db',
  entities: [
    'dist/libs/db/src/entities/*.js',
  ],
  migrations: [
    'dist/libs/db/src/migrations/*.js',
  ],
});
