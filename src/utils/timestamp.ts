
/**
 * 
 * @param {*} value
 * function to convert human readable time to UNIX timestamp
 * 
 * To start: ISO-8601 (2018-06-22T19:29:37.000Z)
 * To finish: UNIX timestamp (1529695777000)
 */
function ToTimestamp(value: string) {
    return Date.parse(value)
}

export default ToTimestamp;