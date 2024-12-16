import { RandomUtils } from './random';

describe('RandomUtils', () => {
  it('generateRandomNumericCode', () => {
    // Arrange.
    const length = 6;

    // Act.
    const result = RandomUtils.generateRandomNumericCode(length);

    // Assert.
    expect(result.length).toBe(length);
    for (let i = 0; i < result.length; i++) {
      const digit = parseInt(result[i]);
      expect(typeof digit).toBe('number');
      expect(digit).not.toBe(NaN);
    }
  });

  it('generateRandomAlphaNumbericCode', () => {
    // Arrange.
    const length = 10;

    // Act.
    const result = RandomUtils.generateRandomAlphaNumbericCode(length);

    // Assert.
    expect(result.length).toBe(length);
    for (let i = 0; i < result.length; i++) {
      const found = RandomUtils.AlphaNumericChars.includes(result[i]);
      expect(found).toBe(true);
    }
  });
});
