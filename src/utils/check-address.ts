let isEthAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/g)

/**
 * Ethereum address validation
 * 
 * This is a clone of Web3 utility (isAddress)
 * But this way is better because size of bundle is smaller
 * RND:
 * https://github.com/cilphex/ethereum-address/blob/master/index.js
 * https://www.npmjs.com/package/crypto-js
 * 
 * TODO: Test for regular expression
 */

function CheckAddress(address: string) {

    if (isEthAddress.test(address)) {
        return true
    }

    return false
}

export default CheckAddress;