import { SHA3 } from 'crypto-js'

/**
 * Regular expression to validate ETH address
 */
let isEthAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/g)

function checkSumAddress(address: string): boolean {
    
    /**
     * Hash the lowercase hexadecimal string from Step-2 using Keccak 256 algorithm.
     * @param {string} value 
     */
    let sha3F = (value: string): string => {
        return SHA3(value, {
            outputLength: 256
        }).toString()
    }

    if (address.toString().substring(0,2) !== '0x') {
        return false
    }
    
    /**
     * Remove the 0x prefix of the hex address.
     */
    let addressR = address.replace('0x', '')

    /**
     * Convert the rest of the address to lower-case.
     */
    let addressHash = sha3F(addressR.toLowerCase())

    /**
     * Compare the obtained hash with the original hex address:
     * Change the nth letter of hexadecimal address to uppercase if the nth bit of the obtained hash is greater than 7.
     * Otherwise, the nth letter of the hexadecimal address should be lowercased.
     */
    for (let i = 0; i < 40; i++) {
        if (
            (parseInt(addressHash[i], 16) > 7 && addressR[i].toUpperCase() !== addressR[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && addressR[i].toLowerCase() !== addressR[i])
        ) {
            return false
        }
    }

    return true
}

/**
 * Ethereum addres validation
 * @param {string} address
 * @return {boolean}
 * 
 * This is a clone of Web3 utility (isAddress)
 * But this way is better because size of bundle is smaller
 * RND:
 * https://github.com/cilphex/ethereum-address/blob/master/index.js
 * https://www.npmjs.com/package/crypto-js
 * 
 * TODO: Test for regular expression
 */

function CheckAddress(address: string): boolean {

    if (isEthAddress.test(address)) {
        return true
    } else if (checkSumAddress(address)) {
        return true
    } else {
        return false
    }
}

export default CheckAddress;