import asyncPool from 'tiny-async-pool';
import { address } from '../interfaces';
import CheckAddress from '../utils/check-address';
import { GetPriceToken } from './cryptocompare';
import * as Utils from '../utils';
import {
  ETHERSCAN_API,
  ETHERSCAN_API_ACCOUNT,
  ETHERSCAN_API_BALANCE,
  ETHERSCAN_API_ADDRESS,
  ETHERSCAN_API_TXLIST,
  ETHERSCAN_API_KEY,
} from '../constants';

function decNum(numero: number): number {
  return numero / 10 ** 18;
}

/**
 * Function to get all transactions of ERC-20 tokens by address
 * @param {string} address
 * @return {object}
 */
export function GetAllTransactions(address: address): any {
  if (CheckAddress(address)) {
    const erc20List = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TXLIST}${ETHERSCAN_API_ADDRESS}${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
    );

    const responseData = async () => {
      let dataInfo = await erc20List;

      return dataInfo;
    };

    return responseData().then(res => {
      let allTransactions = {
        In: [],
        Out: [],
      };
      res.data.result.forEach((element: any) => {
        if (element.to === address.toLowerCase()) {
          allTransactions.In = [
            ...allTransactions.In,
            {
              name: [element.tokenName],
              symbol: [element.tokenSymbol],
              value: decNum(element.value),
              date: Utils.ToTimestamp.ToDate(element.timeStamp),
            },
          ];
        } else {
          allTransactions.Out = [
            ...allTransactions.Out,
            {
              name: [element.tokenName],
              symbol: [element.tokenSymbol],
              value: decNum(element.value),
              date: Utils.ToTimestamp.ToDate(element.timeStamp),
            },
          ];
        }
      });

      return allTransactions;
    });
  }
}

/**
 * Function to get current balance of ETH
 * @param address
 */
export function GetCurrentEthBalance(address: address): any {
  if (CheckAddress(address)) {
    const res = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_BALANCE}${ETHERSCAN_API_ADDRESS}${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`,
    );

    const responseData = async () => {
      let dataInfo = await res;

      return dataInfo;
    };

    return responseData().then(res => {
      return decNum(res.data.result);
    });
  }

  Utils.ThrowError('Not connect with etherscan.io');
}

/**
 * Template for balancing promises
 * 2 async requests
 * @param startData object
 * @param finalArray array
 */
function templatePriceToken(startData: any, finalArray: any[]) {
  const timeout = (i: number) =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            GetPriceToken({ tokenSymbol: i['symbol'][0], timestamp: i['date'] }).then((item: number) => {
              if (item !== null) {
                finalArray = [
                  ...finalArray,
                  {
                    Name: i['name'][0],
                    'Value in ETH': item * i['value'],
                    Symbol: i['symbol'][0],
                    Date: i['date'],
                  },
                ];
              }
            }),
          ),
        i,
      ),
    );

  return asyncPool(2, startData, timeout).then(() => {
    return finalArray;
  });
}

/**
 * Get In Transactions by address
 * @param address string
 * * @returns {Promise} Promise with object in transactions
 */
export function GetInTransactions(address: address) {
  let arrayInTransactions = [];

  return GetAllTransactions(address).then((res: { In: any }) => {
    return templatePriceToken(res.In, arrayInTransactions);
  });
}

/**
 * Get Out Transactions by address
 * @param address string
 * @returns {Promise} Promise with object out transactions
 */
export function GetOutTransactions(address: address): Promise<any> {
  let arrayOutTransactions = [];

  return GetAllTransactions(address).then((res: { Out: any }) => {
    return templatePriceToken(res.Out, arrayOutTransactions);
  });
}
