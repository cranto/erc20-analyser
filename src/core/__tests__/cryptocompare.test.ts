import { GetPriceToken } from '..'

it('Get price token for normal request', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('ETH', 1555505512);
  expect(data).toEqual(1);
})

it('Get price token for normal request with small letters', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('eth', 1555505512);
  expect(data).toEqual(1);
})

it('Get price token for full request', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('ETH', 1555505512, 'BTC');
  expect(data).toEqual(0.03181);
})

it('Get price token for full request with small letters', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('eth', 1555505512, 'btc');
  expect(data).toEqual(0.03181);
})

it('Get price token for normal request', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('ETH', 1555505512);
  expect(data).toEqual(1);
})

it('Get price token for incorrect timestamp', async () => {
  expect.assertions(1);
  const data = await GetPriceToken('ETH', '1a555505512a');
  expect(data).toEqual(0);
})

it('Get price token for incorrect request', async () => {
  await expect(GetPriceToken('LOL', 1555505512)).rejects.toThrow();
})
