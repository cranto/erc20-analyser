it('Check correct timestamp', () => {
    const ToTimestamp = require('../timestamp.ts').default;
    expect(ToTimestamp('2018-06-22T19:29:37.000Z')).toBe(1529695777000);
});
