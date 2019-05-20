import { GetCurrentEthBalance } from '../etherscan';

it('Get current eth balance', async () => {
  expect.assertions(1);
  const data = await GetCurrentEthBalance('0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb');
  expect(data).toEqual(125.026906038826337316);
});
