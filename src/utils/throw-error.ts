/**
 * Function to return an error
 * @param {string} message
 *
 * MDN Error docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 *
 * RND:
 * https://stackoverflow.com/questions/8689516/js-library-best-practice-return-undefined-or-throw-error-on-bad-function-input
 * https://medium.com/@iaincollins/error-handling-in-javascript-a6172ccdf9af
 */
function ThrowError(message: string): never {
  throw new Error(`Something gone wrong: ${message}`);
}

export default ThrowError;
