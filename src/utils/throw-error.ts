/**
 * Function to return an error
 * @param {string} message 
 */
function ThrowError(message: string): never {
    throw new Error(`Something gone wrong: ${message}`)
}

export default ThrowError;