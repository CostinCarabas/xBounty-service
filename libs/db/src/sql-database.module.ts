import { Provider, DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({})
export class SqlDatabaseModule {
  static forFeature(
    entities: EntityClassOrSchema[],
    repositories: Provider[],
  ): DynamicModule {
    return {
      module: SqlDatabaseModule,
      imports: [
        TypeOrmModule.forFeature([
          ...entities,
        ]),
      ],
      providers: [
        ...repositories,
      ],
      exports: [
        ...repositories,
      ],
    };
  }
}
