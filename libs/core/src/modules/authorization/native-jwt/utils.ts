import { InMemoryCacheService } from '@multiversx/sdk-nestjs-cache';
import { NativeAuthServer } from '@multiversx/sdk-native-auth-server';
import { Request } from 'express';
import { NativeJwtConfig } from './config';
import { EncodingUtils } from '@XBounty/common';

export class NativeJwtUtils {
  static isValidRequestHash(
    request: Request,
    requestHash: string,
  ): boolean {
    const route = request.url;
    const body = JSON.stringify(request.body);
    const computedRequestHash = EncodingUtils.sha256Encode(`${route}-${body}`);

    const result = requestHash === computedRequestHash;
    if (!result) {
      console.error('invalid request hash', JSON.stringify({
        route,
        computedRequestHash,
        requestHash,
        body,
      }));
    }
    return result;
  }

  static initializeNativeAuthServer(
    config: NativeJwtConfig,
    inMemoryCacheService: InMemoryCacheService,
  ): NativeAuthServer {
    return new NativeAuthServer({
      apiUrl: config.apiUrl,
      acceptedOrigins: config.acceptedOrigins,
      cache: {
        getValue: async function (key: string): Promise<number | undefined> {
          if (key === 'block:timestamp:latest') {
            return Math.floor(new Date().getTime() / 1000);
          }

          return await inMemoryCacheService.get(key);
        },
        setValue: async function (key: string, value: number, ttl: number): Promise<void> {
          await inMemoryCacheService.set(key, value, ttl);
        },
      },
      maxExpirySeconds: config.maxExpiryInSeconds,
      skipLegacyValidation: true,
    });
  }
}
