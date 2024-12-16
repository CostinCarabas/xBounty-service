import { Injectable } from '@nestjs/common';
import { MetricsServiceInterface } from '@XBounty/common';
import { register } from 'prom-client';

@Injectable()
export class ApiMetricsService implements MetricsServiceInterface {
  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
