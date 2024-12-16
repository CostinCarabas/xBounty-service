import { MetricsService } from '@multiversx/sdk-nestjs-monitoring';
import {
  Controller, Get, Inject, VERSION_NEUTRAL,
} from '@nestjs/common';
import { PROVIDER_TOKEN } from './constants';
import { MetricsServiceInterface } from './metrics.service.interface';

@Controller({
  path: 'metrics',
  version: VERSION_NEUTRAL,
})
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    @Inject(PROVIDER_TOKEN) private readonly providerMetrics: MetricsServiceInterface,
  ) { }

  @Get()
  async getMetrics(): Promise<string> {
    const baseMetrics = await this.metricsService.getMetrics();
    const xPortalMetrics = await this.providerMetrics.getMetrics();
    return baseMetrics + '\n' + xPortalMetrics;
  }
}
