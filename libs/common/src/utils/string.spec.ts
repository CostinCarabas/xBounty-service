import { StringUtils } from './string';

describe('String Utils', () => {
  describe('removeWhiteSpacesOutsideQuotes', () => {
    it('should return the same string', () => {
      const input = 'test_string';
      expect(StringUtils.minifyJsonString(input)).toStrictEqual(input);
    });

    it('should remove white spaces & empty lines', () => {
      const input = 'a    b \n \n c   \n d';
      expect(StringUtils.minifyJsonString(input)).toStrictEqual('abcd');
    });

    it('should not remove white spaces & empty lines that are inside quotes', () => {
      const input = '{ "a": "test object \n " }';
      expect(StringUtils.minifyJsonString(input)).toStrictEqual('{"a":"test object \n "}');
    });
  });
});
