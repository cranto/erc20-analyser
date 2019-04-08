it('Check correct timestamp', () => {
    const ToTimestamp = require('../timestamp.ts');
    expect(ToTimestamp.ToUnix('2018-06-22T19:29:37.000Z')).toBe(1529695777000);
});

it('Check incorrect timestamp', () => {
    const ToTimestamp = require('../timestamp.ts');
    expect(() => {
        ToTimestamp.ToUnix('2018-06-22T1')
    }).toThrow()
});
