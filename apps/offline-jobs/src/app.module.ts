import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfigUtils,
  HealthCheckModule, LoggerModule, MonorepoMetricsModule, RabbitMqInterceptor,
} from '@XBounty/common';
import { ConfigApiModule, getTypeormOptions } from '@XBounty/config';
import configFactory, { getRabbitConfiguration, getSqlDatabaseConfiguration } from './config';
import { CronsModule } from './crons/crons.module';
import { RabbitModule } from '@multiversx/sdk-nestjs-rabbitmq';
import { RabbitExchanges } from '@XBounty/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule,
    ConfigApiModule.register(configFactory),
    HealthCheckModule,
    MonorepoMetricsModule.register(),
    TypeOrmModule.forRoot(getTypeormOptions(getSqlDatabaseConfiguration())),
    RabbitModule.forRoot(
      ConfigUtils.buildRabbitOptions(
        getRabbitConfiguration(),
        [
          RabbitExchanges.newUser,
        ],
      ),
    ),
    CronsModule,
    ConsumersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RabbitMqInterceptor,
    },
  ],
})
export class AppModule { }
