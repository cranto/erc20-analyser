import CheckAddress from '../utils/check-address';
import { ToTimestamp } from '../utils';
import { ETHERSCAN_API_KEY } from '../constants';

const etherscanApi = require('etherscan-api').init(ETHERSCAN_API_KEY);

/**
 * Function to get all transactions of ERC-20 tokens by address
 * @param {string} address
 * @return {object}
 */
export function GetAllTransactions(address: string): any {
  if (CheckAddress(address)) {
    const erc20List = etherscanApi.account.tokentx(address, '', 1, 'latest', 'asc');

    erc20List.then((data: any) => {
      data.result.forEach((element: any) => {
        if (element.to === address.toLowerCase()) {
          return `In: ${element.tokenName}: ${element.value} / ${element.timeStamp}`;
        } else {
          return `Out: ${element.tokenName}: ${element.value} / ${ToTimestamp.ToDate(element.timeStamp)}`;
        }
      });
    });
  }
}

/**
 * Function to get current balance of ETH
 * @param address
 */
export function GetCurrentEthBalance(address: string): any {
  if (CheckAddress(address)) {
    const ethBalance = etherscanApi.account.balance(address);

    ethBalance.then((data: any) => {
      return `Current ETH Balance: ${data.result}`;
    });
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
    const tokenBalance = etherscanApi.account.tokenbalance(address, tokenName, tokenAddress);

    tokenBalance.then((data: any) => {
      return data;
    });
  }
}
