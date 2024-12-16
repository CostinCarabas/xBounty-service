import { DynamicModule, Module } from '@nestjs/common';
import { BypassAuthorizationCheckerService } from './bypass-authorization-checker.service';
import { BypassAuthorizationConfig } from './config';

@Module({})
export class BypassAuthorizationModule {
  static register(config: BypassAuthorizationConfig): DynamicModule {
    return {
      module: BypassAuthorizationModule,
      providers: [
        BypassAuthorizationCheckerService,
        {
          provide: BypassAuthorizationConfig,
          useValue: config,
        },
      ],
      exports: [
        BypassAuthorizationCheckerService,
      ],
    };
  }
}
