
/**
 * 
 * @param {*} value
 * function to convert human readable time to UNIX timestamp
 * 
 * To start: ISO-8601
 * To finish: UNIX timestamp
 */
function toTimestamp(value) {

    let toUnix = function (value) {
        return new Date(value)
    }

    if (typeof value === 'string') {
        return toUnix(value)
    } else {
        return false
    }
}

export default toTimestamp;