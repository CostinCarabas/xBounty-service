import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import {
  DynamicModule, Type,
} from '@nestjs/common';
import { PROVIDER_TOKEN } from './constants';
import { EmptyMetricsService } from './default-metrics.service';
import { MetricsController } from './metrics.controller';

export class MonorepoMetricsModule {
  static register(
    service: Type<unknown> = EmptyMetricsService,
  ): DynamicModule {
    {
      return {
        module: MonorepoMetricsModule,
        global: true,
        imports: [
          MetricsModule,
        ],
        controllers: [
          MetricsController,
        ],
        providers: [
          service,
          {
            provide: PROVIDER_TOKEN,
            useClass: service,
          },
        ],
        exports: [
          MetricsModule,
          service,
        ],
      };
    }
  }
}
