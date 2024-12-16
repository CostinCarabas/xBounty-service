import * as crypto from 'crypto';
import { MultiversXConstants } from '../constants';

export class StringUtils {
  static getFirstOrValue(
    input: string | string[] | undefined,
  ): string | undefined {
    if (!input) {
      return undefined;
    }

    if (Array.isArray(input)) {
      return input[0];
    }
    return input;
  }

  static endsWithElrondSuffix(input: string): boolean {
    return input.endsWith(MultiversXConstants.HEROTAG_SUFFIX);
  }

  static addElrondSuffixIfNeeded(input: string): string {
    if (StringUtils.endsWithElrondSuffix(input)) {
      return input;
    }
    return `${input}${MultiversXConstants.HEROTAG_SUFFIX}`;
  }

  static random(n: number): string {
    if (n <= 0) {
      return '';
    }
    let rs = '';
    try {
      rs = crypto.randomBytes(Math.ceil(n / 2)).toString('hex').slice(0, n);
    } catch (ex) {
      /* known exception cause: depletion of entropy info for randomBytes */
      console.error('Exception generating random string: ' + ex);
      /* weaker random fallback */
      rs = '';
      const r = n % 8, q = (n - r) / 8;
      let i;
      for (i = 0; i < q; i++) {
        rs += Math.random().toString(16).slice(2);
      }
      if (r > 0) {
        rs += Math.random().toString(16).slice(2, i);
      }
    }

    return rs;
  }

  static trimPlusSignPrefix(input: string): string {
    const re = /^\++/g;
    return input.replace(re, '');
  }

  static replace(input: string, str1: string, str2: string): string {
    return input.replace(str1, str2);
  }

  /*
    Given a JSON string, this function will remove white spaces that are outside quotes.
    Example:  StringUtils.minifyJsonString('{ "a": "this is a test" }') -> '{"a":"this is a test"}'
  */
  static minifyJsonString(input: string): string {
    let isInQuotes = false;
    const removeChars = ['\r', '\n', ' '];
    let result = '';

    for (let i = 0; i < input.length; i++) {
      if (input[i] === '"') {
        isInQuotes = !isInQuotes;
      }

      if (!isInQuotes && removeChars.includes(input[i])) {
        continue;
      }

      result += input[i];
    }

    return result;
  }
}
