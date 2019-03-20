
/**
 * 
 * @param {*} value
 * function to convert human readable time to UNIX timestamp
 * 
 * To start: ISO-8601
 * To finish: UNIX timestamp
 */
function ToTimestamp(value: string) {

    let toUnix = function (value: string | number) {
        return new Date(value)
    }

    return toUnix(value)
}

export default ToTimestamp;