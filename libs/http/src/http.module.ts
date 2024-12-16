import { MetricsModule } from '@multiversx/sdk-nestjs-monitoring';
import { Module } from '@nestjs/common';
import { HttpService } from './http.service';

@Module({
  imports: [MetricsModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule { }
