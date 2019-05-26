/**
 * Internal helper to check if parameter is a string
 * @param {*} value
 * @returns {boolean}
 */
export const isString = (value: any): boolean => {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Internal helper to check if string is empty
 * @param {*} value
 * @returns {boolean}
 */
export const isStringEmpty = (value: any): boolean => {
  if (!isString(value)) {
    return false;
  }

  return value.length === 0;
};

/**
 * Internal helper to check if parameter is a number
 * @param {*} value
 * @returns {boolean}
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(value) && !isNaN(parseInt(value));
};

/**
 * Internal helper to check if parameter is an array
 * @param {*} value
 * @returns {boolean}
 */
export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

/**
 * Internal helper to transform numero to decimal format
 * @param {number} numero
 * @param {number} decimal
 * @returns {number}
 */
export const decNum = (numero: number, decimal: number): number => {
  return numero / 10 ** decimal;
};
