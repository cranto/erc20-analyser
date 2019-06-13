import { isString, isStringEmpty, isNumber, isArray, decNum } from '../utilities';

/**
 * isString
 */
it('isString: Value is string', () => {
  expect(isString('string')).toBe(true);
});

it('isString: Value is number', () => {
  expect(isString(1)).toBe(false);
});

it('isString: value is boolean', () => {
  expect(isString(true)).toBe(false);
});

/**
 * isStringEmpty
 */
it('isStringEmpty: value is empty', () => {
  expect(isStringEmpty('')).toBe(true);
});

it('isStringEmpty: value is not empty', () => {
  expect(isStringEmpty('not empty')).toBe(false);
});

it('isStringEmpty: value is number', () => {
  expect(isStringEmpty(123)).toBe(false);
});

it('isStringEmpty: value is boolean', () => {
  expect(isStringEmpty(false)).toBe(false);
});

/**
 * isNumber
 */
it('isNumber: value is number', () => {
  expect(isNumber(1)).toBe(true);
});

it('isNumber: value is string', () => {
  expect(isNumber('value')).toBe(false);
});

it('isNumber: value is boolean', () => {
  expect(isNumber(false)).toBe(false);
});

/**
 * isArray
 */
it('isArray: value is array', () => {
  expect(isArray([1, 2])).toBe(true);
});

it('isArray: value is empty array', () => {
  expect(isArray([])).toBe(true);
});

it('isArray: value is string', () => {
  expect(isArray(123)).toBe(false);
});

it('isArray: value is object', () => {
  expect(isArray({ key: 'value' })).toBe(false);
});

/**
 * decNum
 */
it('decNum: function is correct', () => {
  expect(decNum(0.01, 2)).toBe(0.0001);
});
