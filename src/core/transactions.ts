/**
 * TODO:
 * Replace this package or make queue promises
 */
import asyncPool = require('tiny-async-pool');

import { GetCurrentPriceToken, GetAllTransactions, GetCurrentERC20TokenBalance, GetPriceToken } from './index';
import { EthAddress } from '../interfaces';

/**
 * Function to get amount of all transactions
 * @param arr Array with transactions
 */
export function GetAmount(arr: any[]): object {
  let result = {};

  arr.reduce((acc: any, curr: any) => {
    const key = curr.symbol;

    if (!result[key]) {
      result = {
        ...result,
        [key]: {
          withdraw: curr.withdraw,
          contractAddress: curr.contractAddress,
          name: curr.name,
          symbol: key,
        },
      };
      acc.push(result);
    } else {
      result[key].withdraw += curr.withdraw;
    }

    return acc;
  }, []);

  return result;
}

/**
 * Template for balancing promises
 * 2 async requests
 * @param startData object
 * @param finalArray array
 */
function templatePriceToken(startData: any[], key: string) {
  let localArr = [];

  const timeout = i =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            GetPriceToken({ tokenSymbol: i.symbol, timestamp: i.date }, key)
              .then((item: number) => {
                if (item !== null) {
                  startData.map(e => {
                    if (e.date === i.date && e.symbol === i.symbol) {
                      e = { ...e, eth: item * i.value, withdraw: item * i.value - e.gasUsed };
                      localArr = [...localArr, e];
                    }
                  });
                }
              })
              .catch(err => {
                return err;
              }),
          ),
        i,
      ),
    );

  /**
   * To implement the concurrency behavior of promises
   */
  return asyncPool(2, startData, timeout).then(() => {
    return localArr;
  });
}

/**
 * Get Out Transactions by address
 * @param address string
 * @returns {Promise} Promise with object out transactions
 */
export async function GetOutTransactions(address: EthAddress, key: string): Promise<any> {
  return GetAllTransactions(address, key).then((res: { Out: any }) => {
    return templatePriceToken(res.Out, key);
  });
}

/**
 * Get In Transactions by address
 * @param address string
 * @returns {Promise} Promise with object in transactions
 */
export async function GetInTransactions(address: EthAddress, key: string): Promise<any> {
  return GetAllTransactions(address, key).then((res: { In: any }) => {
    return templatePriceToken(res.In, key);
  });
}

/**
 * Function to get result of token buy/sell
 * @param address {string}
 * @param etherscanKey {string}
 * @returns {Promise}
 */
export async function GetResultErc20Transactions(address: EthAddress, etherscanKey: string): Promise<object> {
  const outSum = GetOutTransactions(address, etherscanKey);
  const inSum = GetInTransactions(address, etherscanKey);

  const result = await Promise.all([outSum, inSum]);

  const outTransactions = GetAmount(result[0]);
  const inTransactions = GetAmount(result[1]);

  const obj = {};

  for (let i = 0, transactions = [outTransactions, inTransactions]; i < transactions.length; i++) {
    for (const key in transactions[i]) {
      if (obj[key] === undefined) {
        obj[key] = transactions[i][key];
      } else {
        obj[key] = {
          ...obj[key],
          withdraw: obj[key].withdraw - transactions[i][key].withdraw,
        };
      }
    }
  }

  return obj;
}

/**
 * Function to get current balance with hold
 * @param address
 * @param key
 * @returns {Promise}
 */
export async function GetERC20TokenBalanceWithHold(
  address: EthAddress,
  etherscanKey: string,
  cryptocompareKey: string,
): Promise<object> {
  let final = {};

  return GetResultErc20Transactions(address, etherscanKey).then(response => {
    const responseObj = Object.values(response);

    const timeout = i =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              GetCurrentERC20TokenBalance(address, i.contractAddress, etherscanKey).then(r => {
                return GetCurrentPriceToken(i.symbol, 'ETH', cryptocompareKey).then(price => {
                  if (price !== null && price !== undefined) {
                    final = {
                      ...final,
                      [i.symbol]: i.withdraw + r * price,
                    };
                  }
                });
              }),
            ),
          i,
        ),
      );

    return asyncPool(2, responseObj, timeout).then(() => {
      return final;
    });
  });
}
