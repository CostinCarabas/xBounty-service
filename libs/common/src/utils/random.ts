import * as crypto from 'crypto';

export class RandomUtils {
  static AlphaNumericChars = '0123456789abcdefghijklmnopqrstuvwxyz';

  static generateRandomNumericCode(length: number): string {
    let confirmationCode = '';

    do {
      const randomBytes = crypto.randomBytes(5);
      confirmationCode = parseInt(randomBytes.toString('hex'), 16)
        .toString()
        .substring(0, 6);
    }
    while (confirmationCode.length < length);

    return confirmationCode;
  };

  static generateRandomAlphaNumbericCode(length: number): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * RandomUtils.AlphaNumericChars.length);
      result += RandomUtils.AlphaNumericChars[randomIndex];
    }

    return result;
  }
}
