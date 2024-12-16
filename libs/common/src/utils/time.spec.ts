import { TimeConstants } from '../constants';
import { TimeUtils } from './time';

describe('TimeUtils', () => {
  it('getSecondsLeftInDay', async () => {
    // Arrange.
    const errors: Date[] = [];

    for (const test of scenarios) {
      try {
        // Act.
        const result = TimeUtils.getSecondsLeftInDay(test.input);

        // Assert.
        expect(result).toEqual(test.result);
      } catch {
        errors.push(test.input);
      }
    }
    if (errors.length > 0) {
      throw new Error(`TimeUtils getSecondsLeftInDay - test failed for ${errors.join(', ')}.`);
    }
  });
});

const scenarios = [
  {
    input: new Date('2022-01-01T23:00:00.000Z'),
    result: TimeConstants.oneHour,
  },
  {
    input: new Date('2022-01-01T21:30:01.000Z'),
    result: TimeConstants.oneHour * 2 + TimeConstants.oneHour / 2 - 1,
  },
  {
    input: new Date('2022-01-01T01:29:34.000Z'),
    result: TimeConstants.oneHour * 22 + TimeConstants.oneHour / 2 + 26,
  },
];
