import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule, ConfigObject } from '@nestjs/config';
import { ConfigApiService } from './config-api.service';

@Global()
@Module({})
export class ConfigApiModule {
  static register(
    configFactory: ConfigFactory<ConfigObject>,
  ): DynamicModule {
    return {
      module: ConfigApiModule,
      imports: [
        ConfigModule.forRoot({
          load: [configFactory],
        }),
      ],
      providers: [ConfigApiService],
      exports: [ConfigApiService],
    };
  }
}
