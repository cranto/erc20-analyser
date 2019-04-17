import CheckAddress from '../check-address'

it('Check correct ETH address', () => {
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC31')).toBe(true);
});

it('Check long ETH address', () => {
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC311')).toBe(false);
});

it('Check short ETH address', () => {
  expect(CheckAddress('0x37DF0D9bEccd412951500f0e33f0c3721Fb4dC3')).toBe(false);
});

it('Check strange ETH address', () => {
  expect(CheckAddress('1x37DF0D9bEccd412951500f0e33f0c3721Fb4dC31')).toBe(false);
});

it('Check not correct ETH address', () => {
  expect(CheckAddress('0xc6d9d2cd449a754c494264e1809c50e34d64562basd')).toBe(false);
});
