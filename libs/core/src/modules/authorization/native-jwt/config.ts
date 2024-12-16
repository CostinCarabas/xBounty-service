import { EnvConfigurationEnum } from '@XBounty/config';

export class NativeJwtConfig {
  apiUrl: string;
  maxExpiryInSeconds: number;
  acceptedOrigins: string[];
  env: EnvConfigurationEnum;
};
