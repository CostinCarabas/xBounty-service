import { Request } from 'express';
import { StringUtils } from './string';

export class RequestUtils {
  static extractHeader(
    request: Request,
    headerName: string,
  ): string | undefined {
    return StringUtils.getFirstOrValue(request.headers[headerName]);
  }

  static extractParam(
    request: Request,
    paramName: string,
  ): string | undefined {
    return StringUtils.getFirstOrValue(request.params[paramName]);
  }
}
