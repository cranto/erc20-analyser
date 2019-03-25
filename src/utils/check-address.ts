let isEthAddress = new RegExp(`!/^(0x)?[0-9a-f]{40}$/i`)

function CheckAddress(address: string) {

    if (isEthAddress.test(address)) {
        return true
    }

    return false
}

export default CheckAddress;