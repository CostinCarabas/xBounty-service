import { NumbersUtils } from './numbers';

describe('NumbersUtils', () => {
  it('Denominate value ', async () => {
    // Arrange.
    for (const test of tests) {
      // Act.
      const result = NumbersUtils.denominate(test.input, test.normalized, test.denomination);

      // Assert.
      expect(result).toBe(test.result);
    }
  });

  describe('Calculate Rounded Change', () => {
    test
      .each`
          first | last | percentage
          ${1500} | ${1200} | ${-20}
          ${100} | ${90} | ${-10}
          ${10} | ${11} | ${10}
          ${45.43} | ${43.57} | ${-4.09}
        `
      (
        'should return $percentage %',
        async ({ first, last, percentage }) => {
          const percentageChange = NumbersUtils.calculateRoundedChange(first, last);

          expect(percentageChange).toStrictEqual(percentage);
        },
      );
  });

  describe('Number To Balance', () => {
    test
      .each`
          input | decimals | result
          ${0} | ${18} | ${'0'}
          ${1} | ${18} | ${'1000000000000000000'}
          ${2.5} | ${6} | ${'2500000'}
          ${25000} | ${18} | ${'25000000000000000000000'}
        `
      (
        'should return $result',
        async ({ input, decimals, result }) => {
          const percentageChange = NumbersUtils.numberToBalance(input, decimals);

          expect(percentageChange).toStrictEqual(result);
        },
      );
  });
});

const tests = [
  {
    input: '10000000',
    normalized: true,
    denomination: 18,
    result: '0.00000000001',
  },
  {
    input: '1',
    normalized: true,
    denomination: 18,
    result: '0.000000000000000001',
  },
  {
    input: '10',
    normalized: true,
    denomination: 18,
    result: '0.00000000000000001',
  },
  {
    input: '100',
    normalized: true,
    denomination: 18,
    result: '0.0000000000000001',
  },
  {
    input: '1000010000000',
    normalized: true,
    denomination: 18,
    result: '0.00000100001',
  },
  {
    input: '5001000010000000',
    normalized: true,
    denomination: 18,
    result: '0.00500100001',
  },
  {
    input: '32110000000',
    normalized: true,
    denomination: 18,
    result: '0.00000003211',
  },
  {
    input: '1000000000000000000',
    normalized: true,
    denomination: 18,
    result: '1',
  },
  {
    input: '10000000000000000000',
    normalized: true,
    denomination: 18,
    result: '10',
  },
  {
    input: '10550000000000000000',
    normalized: true,
    denomination: 18,
    result: '10.55',
  },
  {
    input: '1500000000000000000',
    normalized: true,
    denomination: 18,
    result: '1.5',
  },
  {
    input: '21530000000003000000',
    normalized: true,
    denomination: 18,
    result: '21.530000000003',
  },
  {
    input: '500000000000000000',
    normalized: true,
    denomination: 18,
    result: '0.5',
  },
  {
    input: '100505000000000000000',
    normalized: true,
    denomination: 18,
    result: '100.505',
  },
  {
    input: '10000000',
    normalized: false,
    denomination: 18,
    result: '0.000000000010000000',
  },
  {
    input: '1',
    normalized: false,
    denomination: 18,
    result: '0.000000000000000001',
  },
  {
    input: '10',
    normalized: false,
    denomination: 18,
    result: '0.000000000000000010',
  },
  {
    input: '100',
    normalized: false,
    denomination: 18,
    result: '0.000000000000000100',
  },
  {
    input: '1000010000000',
    normalized: false,
    denomination: 18,
    result: '0.000001000010000000',
  },
  {
    input: '5001000010000000',
    normalized: false,
    denomination: 18,
    result: '0.005001000010000000',
  },
  {
    input: '32110000000',
    normalized: false,
    denomination: 18,
    result: '0.000000032110000000',
  },
  {
    input: '1000000000000000000',
    normalized: false,
    denomination: 18,
    result: '1.000000000000000000',
  },
  {
    input: '10000000000000000000',
    normalized: false,
    denomination: 18,
    result: '10.000000000000000000',
  },
  {
    input: '10550000000000000000',
    normalized: false,
    denomination: 18,
    result: '10.550000000000000000',
  },
  {
    input: '1500000000000000000',
    normalized: false,
    denomination: 18,
    result: '1.500000000000000000',
  },
  {
    input: '21530000000003000000',
    normalized: false,
    denomination: 18,
    result: '21.530000000003000000',
  },
  {
    input: '500000000000000000',
    normalized: false,
    denomination: 18,
    result: '0.500000000000000000',
  },
  {
    input: '100505000000000000000',
    normalized: false,
    denomination: 18,
    result: '100.505000000000000000',
  },
  {
    input: '1',
    normalized: true,
    denomination: 8,
    result: '0.00000001',
  },
  {
    input: '10',
    normalized: true,
    denomination: 8,
    result: '0.0000001',
  },
  {
    input: '100',
    normalized: true,
    denomination: 8,
    result: '0.000001',
  },
  {
    input: '1000',
    normalized: true,
    denomination: 8,
    result: '0.00001',
  },
  {
    input: '10000',
    normalized: true,
    denomination: 8,
    result: '0.0001',
  },
  {
    input: '100000',
    normalized: true,
    denomination: 8,
    result: '0.001',
  },
  {
    input: '1000000',
    normalized: true,
    denomination: 8,
    result: '0.01',
  },
  {
    input: '10000000',
    normalized: true,
    denomination: 8,
    result: '0.1',
  },
  {
    input: '100000000',
    normalized: true,
    denomination: 8,
    result: '1',
  },
  {
    input: '150000000',
    normalized: true,
    denomination: 8,
    result: '1.5',
  },
  {
    input: '10000000000',
    normalized: true,
    denomination: 8,
    result: '100',
  },
  {
    input: '10005000000',
    normalized: true,
    denomination: 8,
    result: '100.05',
  },
  {
    input: '1',
    normalized: false,
    denomination: 8,
    result: '0.00000001',
  },
  {
    input: '10',
    normalized: false,
    denomination: 8,
    result: '0.00000010',
  },
  {
    input: '100',
    normalized: false,
    denomination: 8,
    result: '0.00000100',
  },
  {
    input: '1000',
    normalized: false,
    denomination: 8,
    result: '0.00001000',
  },
  {
    input: '10000',
    normalized: false,
    denomination: 8,
    result: '0.00010000',
  },
  {
    input: '100000',
    normalized: false,
    denomination: 8,
    result: '0.00100000',
  },
  {
    input: '1000000',
    normalized: false,
    denomination: 8,
    result: '0.01000000',
  },
  {
    input: '10000000',
    normalized: false,
    denomination: 8,
    result: '0.10000000',
  },
  {
    input: '100000000',
    normalized: false,
    denomination: 8,
    result: '1.00000000',
  },
  {
    input: '150000000',
    normalized: false,
    denomination: 8,
    result: '1.50000000',
  },
  {
    input: '10000000000',
    normalized: false,
    denomination: 8,
    result: '100.00000000',
  },
  {
    input: '10005000000',
    normalized: false,
    denomination: 8,
    result: '100.05000000',
  },
];
