import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  path: 'health-check',
  version: VERSION_NEUTRAL,
})
export class HealthCheckController {
  @Get()
  healthCheck(): string {
    return 'OK!';
  }
}
