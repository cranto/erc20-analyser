import CheckAddress from '../utils/check-address'
import {ETHERSCAN_API_KEY} from '../constants'

let etherscanApi = require('etherscan-api').init(ETHERSCAN_API_KEY)
let stateTokens = {}

/**
 * Function to get all transactions of ERC-20 tokens by address
 * @param {string} address 
 * @return {object}
 */
export function GetAllTransactions(address: string): any {
    if (CheckAddress(address)) {
        let erc20List = etherscanApi.account.tokentx(address, '', 1, 'latest', 'asc')

        erc20List.then((data: any) => {
            data.result.forEach((element: any) => {
                if (element.to === address.toLowerCase()) {
                    console.log(`In: ${element.tokenName}: ${element.value}`)

                } else {
                    console.log(`Out: ${element.tokenName}: ${element.value}`)
                }
            })
        }).then(() => {
            console.log(stateTokens)
        })
    }
}

/**
 * Function to get current balance of ETH
 * @param address 
 */
export function GetCurrentEthBalance(address: string): any {
    if (CheckAddress(address)) {
        let ethBalance = etherscanApi.account.balance(address)

        ethBalance.then((data: any) => {
            console.log(`Current ETH Balance: ${data.result}`)
        })
    }
}

/**
 * 
 * @param address {string}
 * @param tokenAddress {string}
 * @param tokenName {string}
 */
export function GetCurrentTokenBalance(address: string, tokenAddress: string, tokenName?: string) {
    if (CheckAddress(address)) {
        let tokenBalance = etherscanApi.account.tokenbalance(address, tokenName, tokenAddress)

        tokenBalance.then((data: any) => {
            console.log(data)
        })
    }
}