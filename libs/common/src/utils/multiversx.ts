import { Address } from '@multiversx/sdk-core';

export class MultiversXUtils {
  static isValidAddress(input: string): boolean {
    try {
      Address.fromBech32(input);
      return true;
    } catch {
      return false;
    }
  }
}
