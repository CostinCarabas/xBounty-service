export const RegexUtils = {
  nftIdentifier: /^[A-Z0-9]{3,10}-[a-f0-9]{6}-[a-f0-9]{2,}$/,
  nftCollection: /^[A-Z0-9]{3,10}-[a-f0-9]{6}$/,
  esdtIdentifier: /^[A-Z0-9]{3,10}-[a-f0-9]{6}$/,
  address: /^erd[a-z0-9]{59,59}$/,
  alphaCharacters: /^[a-zA-Z]*$/,
  saveKeyValueTransaction: /^SaveKeyValue(@[0-9a-fA-F]{2,}@[0-9a-fA-F]{2,}){1,}/,
  sha256: /[A-Fa-f0-9]{64}/,
  floatNumber: /^[0-9]+\.?[0-9]*$/,
};
