import moment from 'moment';
import { TimeConstants } from '../constants';

export class TimeUtils {
  static getSecondsLeftInDay(date: Date): number {
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const totalSecondsToday = (hour * 60 + minutes) * 60 + seconds;
    const totalSecondsInADay = 86400;

    return totalSecondsInADay - totalSecondsToday;
  };

  static getDateFromSeconds(input: number): Date {
    return new Date(TimeUtils.getMiliseconds(input));
  }

  static getUnixSecondsFromMiliseconds(input: number): number {
    return Math.floor(input / 1000);
  }

  static getUnixSeconds(input: Date): number {
    return Math.floor(input.getTime() / 1000);
  }

  static getMiliseconds(seconds: number): number {
    return seconds * 1000;
  }

  static isOlderThan(
    date: Date,
    amount: number,
    period: 'minute' | 'hour' | 'day' | 'month' | 'year',
  ): boolean {
    const oneYearAgo = moment().subtract(amount, period);
    return moment(date).isBefore(oneYearAgo);
  }

  static getPastDate(days: number): Date {
    const nowInSeconds = TimeUtils.getUnixSeconds(new Date());

    const pastDateInSeconds = nowInSeconds - TimeConstants.oneDay * days;

    return new Date(pastDateInSeconds * 1000);
  }

  static getMinBetweenNowAndDate = (input: Date): number => {
    const currentTime = new Date().getTime();
    let dateTo = input.getTime();
    if (currentTime < dateTo) {
      dateTo = currentTime;
    }
    return dateTo;
  };

  // Returns YYYY-MM-DD format
  static formatToDateOnlyString(input: Date): string {
    return moment(input).format('yyyy-MM-DD');
  }
}
