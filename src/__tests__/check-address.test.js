it('Check correct ETH address', () => {
  const CheckAddress = require('../utils/check-address.ts').default;
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC31')).toBe(true);
});

it('Check long ETH address', () => {
  const CheckAddress = require('../utils/check-address.ts').default;
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC311')).toBe(false);
});

it('Check short ETH address', () => {
  const CheckAddress = require('../utils/check-address.ts').default;
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC3')).toBe(false);
});

it('Check number', () => {
  const CheckAddress = require('../utils/check-address.ts').default;
  expect(CheckAddress(123)).toBe(false);
});

it('Check strange ETH address', () => {
  const CheckAddress = require('../utils/check-address.ts').default;
  expect(CheckAddress('1x37DF0D9bEccd412951500f0e33f0c3721Fb4dC31')).toBe(false);
});