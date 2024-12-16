import { RegexUtils } from './regex';

describe('RegexUtils', () => {
  it('Address', async () => {
    // Arrange.
    const tests = addressTests;
    const regex = new RegExp(RegexUtils.address);

    const errors: string[] = [];

    for (const test of tests) {
      try {
        // Act.
        const match = regex.test(test.input);

        // Assert.
        expect(match).toEqual(test.result);
      } catch {
        errors.push(test.input);
      }
    }
    if (errors.length > 0) {
      throw new Error(`RegexUtils Address - test failed for ${errors.join(', ')}.`);
    }
  });

  it('NFT Identifier', async () => {
    // Arrange.
    const tests = nftIdentifierTests;
    const regex = new RegExp(RegexUtils.nftIdentifier);

    const errors: string[] = [];

    for (const test of tests) {
      try {
        // Act.
        const match = regex.test(test.input);

        // Assert.
        expect(match).toEqual(test.result);
      } catch {
        errors.push(test.input);
      }
    }
    if (errors.length > 0) {
      throw new Error(`RegexUtils NFT Identifier - test failed for ${errors.join(', ')}.`);
    }
  });

  it('NFT Collections', async () => {
    // Arrange.
    const tests = nftCollectionTests;
    const regex = new RegExp(RegexUtils.nftCollection);

    const errors: string[] = [];

    for (const test of tests) {
      try {
        // Act.
        const match = regex.test(test.input);

        // Assert.
        expect(match).toEqual(test.result);
      } catch {
        errors.push(test.input);
      }
    }
    if (errors.length > 0) {
      throw new Error(`RegexUtils NFT Collection - test failed for ${errors.join(', ')}.`);
    }
  });
});

const addressTests = [
  {
    input: 'erd1',
    result: false,
  },
  {
    input: 'erd12tqmq6a2gf2dkgdn7x043r6rgcn403u0mx3huwvcn5d3lmahh7qsjxuacp',
    result: true,
  },
  {
    input: 'zxd12tqmq6a2gf2dkgdn7x043r6rgcn403u0mx3huwvcn5d3lmahh7qsjxuacp',
    result: false,
  },
  {
    input: 'erd12tqmq6a2gf2dkgdn7x043r6rgcn403u0mx3huwvcn5d3lmahh7qsjxuacp1',
    result: false,
  },
  {
    input: 'erd12tqmq6a2gf2dkgdn7x043r6rgcn403u0mx3huwvcn5d3lmahh7qsjxuac',
    result: false,
  },
];

const nftIdentifierTests = [
  {
    input: 'NF-0adfe3-01',
    result: false,
  },
  {
    input: 'NFT-0adfe3-01',
    result: true,
  },
  {
    input: 'NFT-0adfe3-0',
    result: false,
  },
  {
    input: 'NFT01-0adfe3-01',
    result: true,
  },
  {
    input: 'NFT01-0adfe3-ab',
    result: true,
  },
  {
    input: 'NFt01-0adfe3-ab',
    result: false,
  },
  {
    input: 'NFT01-0gdfe3-ab',
    result: false,
  },
  {
    input: 'NFHELLO001-0adfe3-ab',
    result: true,
  },
  {
    input: 'NFTHELLO001-0adfe3-ab',
    result: false,
  },
  {
    input: 'NFT-0aadfe3-ab',
    result: false,
  },
  {
    input: 'NFT-0aadfe3-az',
    result: false,
  },
];

const nftCollectionTests = [
  {
    input: 'NF-0adfe3',
    result: false,
  },
  {
    input: 'NFT-0adfe3',
    result: true,
  },
  {
    input: 'NFT-0adefe3',
    result: false,
  },
  {
    input: 'NFT01-0adfe3',
    result: true,
  },
  {
    input: 'NFT01-0gdfe3',
    result: false,
  },
  {
    input: 'NFHELLO001-0adfe3',
    result: true,
  },
  {
    input: 'NFTHELLO001-0adfe3',
    result: false,
  },
];
