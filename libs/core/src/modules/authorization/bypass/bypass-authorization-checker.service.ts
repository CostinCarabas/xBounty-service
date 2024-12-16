import { Injectable } from '@nestjs/common';
import { EnvUtils, RequestUtils } from '@XBounty/common';
import { Request } from 'express';
import { AuthorizationHeaders } from '../headers';
import { BypassAuthorizationConfig } from './config';

@Injectable()
export class BypassAuthorizationCheckerService {
  constructor(private readonly bypassConfig: BypassAuthorizationConfig) { }

  check(request: Request): boolean {
    if (EnvUtils.isMainnet(this.bypassConfig.env)) {
      return false;
    }

    const bypassAddress = RequestUtils.extractHeader(
      request,
      AuthorizationHeaders.userAddress,
    );

    return !!bypassAddress;
  }
}
