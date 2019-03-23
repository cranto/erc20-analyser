
/**
 * 
 * @param {*} value
 * function to convert human readable time to UNIX timestamp
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
function ToTimestamp(value: string) {

    return Date.parse(value)
}

export default ToTimestamp;