import { EnvConfigurationEnum } from '@XBounty/config';

export class EnvUtils {
  static isMainnet(env: EnvConfigurationEnum): boolean {
    return env === EnvConfigurationEnum.mainnet;
  }

  static isDevnetOrTestnet(env: EnvConfigurationEnum): boolean {
    return [EnvConfigurationEnum.devnet, EnvConfigurationEnum.testnet].includes(env);
  }
}
