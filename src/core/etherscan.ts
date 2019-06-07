import asyncPool from 'tiny-async-pool';
import { EthAddress, IEtherscanRequest } from '../interfaces';
import CheckAddress from '../utils/check-address';
import { GetPriceToken, GetCurrentPriceToken } from './cryptocompare';
import * as Utils from '../utils';
import {
  ETHERSCAN_API,
  ETHERSCAN_API_ACCOUNT,
  ETHERSCAN_API_BALANCE,
  ETHERSCAN_API_ADDRESS,
  ETHERSCAN_API_TXLIST,
  ETHERSCAN_API_TOKENBALANCE,
} from '../constants';

/**
 * Helper function to check correct answer from etherscan.io
 * @param response {object}
 * @returns {object}
 */
function checkCorrectRequest(response: IEtherscanRequest): object {
  if (response.data.status === '1' && response.data.message === 'OK') {
    return response.data.result;
  } else {
    Utils.ThrowError(response.data.message);
  }
}

/**
 * Function to get current balance of token
 * @param contract {string}
 * @param address {string}
 * @param key {string}
 * @returns {Promise<number>}
 */
export function GetCurrentERC20TokenBalance(address: EthAddress, contract: string, key: string): Promise<number> {
  const tokenBalanceReq = Utils.WrapperRequest(
    `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TOKENBALANCE}${contract}${ETHERSCAN_API_ADDRESS}${address}&tag=latest&apiKey=${key}`,
  );
  const tokenDecimalReq = Utils.WrapperRequest(
    `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TXLIST}&contractaddress=${contract}&address=${address}&page=1&offset=100&sort=asc&apiKey=${key}`,
  );

  const request = async () => {
    /**
     * Get current balance of token
     */
    let responseBalance = checkCorrectRequest(await tokenBalanceReq);

    /**
     * Get token decimal information
     */
    let responseDecimal = checkCorrectRequest(await tokenDecimalReq);

    /**
     * Check type of response and return decimal information
     */
    let decimalAns = Array.isArray(responseDecimal)
      ? responseDecimal[0]['tokenDecimal']
      : responseDecimal['tokenDecimal'];

    /**
     * Return number of current token balance
     */
    return Utils.Checkers.decNum(Number(responseBalance), decimalAns);
  };

  return request();
}

/**
 * Function to get all transactions of ERC-20 tokens by address
 * @param {string} address
 * @return {object}
 */
export function GetAllTransactions(address: EthAddress, key: string): any {
  if (CheckAddress(address)) {
    const erc20List = Utils.WrapperRequest(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TXLIST}${ETHERSCAN_API_ADDRESS}${address}&startblock=0&endblock=99999999&sort=asc&apikey=${key}`,
    );

    let allTransactions = {
      In: [],
      Out: [],
    };

    let formationTransactionObj = (element: {
      timeStamp: string | number;
      contractAddress: string;
      tokenName: string;
      tokenSymbol: string;
      value: number;
      tokenDecimal: number;
      gasPrice: number;
      gasUsed: number;
    }) => {
      return {
        date: Number(element.timeStamp),
        contractAddress: element.contractAddress,
        name: element.tokenName,
        symbol: element.tokenSymbol,
        value: Utils.Checkers.decNum(element.value, element.tokenDecimal),
        gasUsed: Utils.Checkers.decNum(element.gasPrice, 18) * element.gasUsed,
      };
    };

    return erc20List.then(res => {
      res.data.result.forEach((element: any) => {
        if (element.to.toLowerCase() === address.toLowerCase()) {
          allTransactions.In = [...allTransactions.In, formationTransactionObj(element)];
        } else {
          allTransactions.Out = [...allTransactions.Out, formationTransactionObj(element)];
        }
      });

      return allTransactions;
    });
  }
}

/**
 * Function to get current balance of ETH by address
 * @param address
 */
export function GetCurrentEthBalance(address: EthAddress, key: string): any {
  if (CheckAddress(address)) {
    const res = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_BALANCE}${ETHERSCAN_API_ADDRESS}${address}&tag=latest&apikey=${key}`,
    );

    const responseData = async () => {
      const dataInfo = await res;

      return dataInfo;
    };

    return responseData().then(response => {
      if (response.data.status === '1' && response.data.message === 'OK') {
        return Utils.Checkers.decNum(response.data.result, 18);
      } else {
        Utils.ThrowError(response.data.message);
      }
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
 * Function to get result of token buy/sell
 * @param address {string}
 * @param etherscanKey {string}
 * @returns {Promise}
 */
export async function GetResultErc20Transactions(address: EthAddress, etherscanKey: string): Promise<object> {
  const outSum = GetOutTransactions(address, etherscanKey);
  const inSum = GetInTransactions(address, etherscanKey);

  const result = await Promise.all([outSum, inSum]);

  let outTransactions = SumTransactions(result[0]);
  let inTransactions = SumTransactions(result[1]);

  let obj = {};

  for (let i = 0, transactions = [outTransactions, inTransactions]; i < transactions.length; i++) {
    for (let key in transactions[i]) {
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
    let test = Object.values(response);

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

    return asyncPool(2, test, timeout).then(() => {
      return final;
    });
  });
}

/**
 * Function to sum identical tokens
 */
export function SumTransactions(arr: any[]) {
  /**
   * Final object
   */
  let resultObj = {};

  arr.reduce((acc: any, curr: any) => {
    const key = curr.symbol;

    if (!resultObj[key]) {
      resultObj = {
        ...resultObj,
        [key]: {
          withdraw: curr.withdraw,
          contractAddress: curr.contractAddress,
          name: curr.name,
          symbol: key,
        },
      };
      acc.push(resultObj);
    } else {
      resultObj[key].withdraw += curr.withdraw;
    }

    return acc;
  }, []);

  return resultObj;
}
