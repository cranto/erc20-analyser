import { ToUnix, ToDate } from '../timestamp';

it('Check correct timestamp', () => {
  expect(ToUnix('2018-06-22T19:29:37.000Z')).toBe(1529695777000);
});

it('Check incorrect timestamp', () => {
  expect(() => {
    ToUnix('2018-06-22T1');
  }).toThrow();
});

it('Check correct timestamp to date', () => {
  expect(ToDate(1555505512).toString()).toBe('Wed, 17 Apr 2019 12:51:52 GMT');
});
