import { Injectable } from '@nestjs/common';
import { register } from 'prom-client';
import { MetricsServiceInterface } from './metrics.service.interface';

@Injectable()
export class EmptyMetricsService implements MetricsServiceInterface {
  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
