import { RabbitModule } from '@multiversx/sdk-nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfigUtils, HealthCheckModule, LoggerModule, MonorepoMetricsModule,
} from '@XBounty/common';
import { ConfigApiModule, getTypeormOptions } from '@XBounty/config';
import configFactory, {
  getEnv, getMultiversXApisConfiguration, getNativeAuthConfiguration,
  getRabbitConfiguration, getSqlDatabaseConfiguration,
} from './config';
import { ApiMetricsService } from './common';
import { NativeRegularJwtModule, RabbitExchanges } from '@XBounty/core';
import { EndpointsModule } from './endpoints/endpoints.module';

@Module({
  imports: [
    ConfigApiModule.register(configFactory),
    LoggerModule,
    TypeOrmModule.forRoot(getTypeormOptions(getSqlDatabaseConfiguration())),
    NativeRegularJwtModule.register(
      {
        apiUrl: getMultiversXApisConfiguration().api,
        maxExpiryInSeconds: getNativeAuthConfiguration().maxExpiryInSeconds,
        acceptedOrigins: getNativeAuthConfiguration().acceptedOrigins,
        env: getEnv(),
      },
    ),
    MonorepoMetricsModule.register(ApiMetricsService),
    HealthCheckModule,
    RabbitModule.forRoot(
      ConfigUtils.buildRabbitOptions(
        getRabbitConfiguration(),
        [
          RabbitExchanges.newUser,
        ],
      ),
    ),
    EndpointsModule,
  ],
})
export class AppModule { }
