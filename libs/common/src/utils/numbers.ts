import BigNumber from 'bignumber.js';
import { UnitEnum } from '../enums';
import { RegexUtils } from './regex';

export class NumbersUtils {
  static FloatNumberRegExp = new RegExp(RegexUtils.floatNumber);

  static numberToBalance(
    input: string,
    decimals: number,
  ): string {
    return new BigNumber(input).multipliedBy(Math.pow(10, decimals)).toFixed();
  }

  static denominate(
    input: string,
    normalized = false,
    denomination = 18,
  ): string {
    const array = input.toString().split('');

    if (denomination !== 0) {
      // make sure we have enough characters
      while (array.length < denomination + 1) {
        array.unshift('0');
      }

      // add our dot
      array.splice(array.length - denomination, 0, '.');
    }

    if (normalized) {
      return NumbersUtils.removeTrailingZeros(array);
    }

    return array.join('');
  };

  static removeTrailingZeros(array: string[]): string {
    loop:
    for (let i = array.length - 1; i >= 0; i--) {
      switch (array[i]) {
        case '0':
          array.pop();
          continue loop;
        case '.':
          array.pop();
          break loop;
        default:
          break loop;
      }
    }

    return array.join('');
  };

  static convert(
    value: string,
    from: UnitEnum,
    to: UnitEnum,
  ): string | undefined {
    if (!NumbersUtils.FloatNumberRegExp.test(value)) {
      return;
    }

    return new BigNumber(value, 10).multipliedBy(from).div(to).toString(10);
  };

  static calculateChange(
    current: number,
    reference: number,
  ): number {
    return (current - reference) / reference * 100;
  }

  static calculateRoundedChange(
    reference: number,
    current: number,
  ): number {
    const change = this.calculateChange(current, reference);

    if (change > 0) {
      return this.round(change, 2, true);
    }

    return this.round(change, 2, false);
  }

  static round(
    input: number,
    decimals: number,
    floor = true,
  ): number {
    const decimalsNumber = Math.pow(10, decimals);
    const number = input * decimalsNumber;
    if (floor) {
      return Math.floor(number) / decimalsNumber;
    }
    return Math.ceil(number) / decimalsNumber;
  }
}
