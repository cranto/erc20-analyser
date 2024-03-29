import ThrowError from './throw-error';

/**
 * Reg Exp for check format ISO 8601
 *
 * W3C Specification: https://www.w3.org/TR/NOTE-datetime
 * ISO-8601 Specification by 2004: http://dotat.at/tmp/ISO_8601-2004_E.pdf
 * Stackoverflow discuss: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
 * RND Reg Exp ISO-8601: https://www.regextester.com/97766
 *
 * TODO: Create test for regular expression
 */
const regExpISO8601 = new RegExp(
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g,
);

/**
 *
 * @param {string} value
 * Helper function to convert human readable time to UNIX timestamp
 * Using function Date.parse() but if get parameter with date from another API to change this function
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Using_Date.parse()
 *
 * TODO: abstract date or function to convert for correct format
 *
 * To start: ISO-8601 (2018-06-22T19:29:37.000Z)
 *
 * Date objects use a Unix Time Stamp, an integer value that is the number of milliseconds since 1 January 1970 00:00:00 UTC
 * To finish: UNIX timestamp (1529695777000)
 */

export function ToUnix(value: string): number {
  if (regExpISO8601.test(value)) {
    return Date.parse(value);
  }

  ThrowError("Transformation from ISO-8601 to UNIX isn't correct.");
}

/**
 * Helper function to convert UNIX time to UTC time
 * @param value UNIX Timestamp
 * @returns UTC Time
 */
export function ToDate(value: number): any {
  return new Date(value * 1000).toUTCString();
}
