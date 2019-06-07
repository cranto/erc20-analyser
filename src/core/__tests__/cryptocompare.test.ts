import { GetPriceToken, GetCurrentPriceToken } from '..';

it('Cryptocompare function – GetPriceToken, default', async () => {
  expect.assertions(1);

  const data = await GetPriceToken({ tokenSymbol: 'BNB', timestamp: '1555505512', toConvert: 'ETH' }, '');

  expect(data).toEqual(0.1175);
});
