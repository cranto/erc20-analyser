import asyncPool from 'tiny-async-pool';
import { EthAddress } from '../interfaces';
import CheckAddress from '../utils/check-address';
import { GetPriceToken } from './cryptocompare';
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
 * Function to get current balance of token
 * @param contract
 * @param address
 * @param key
 */
export function GetCurrentERC20TokenBalance(contract: string, address: EthAddress, key: string) {
  const tokenBalance = Utils.Request(
    `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TOKENBALANCE}${contract}${ETHERSCAN_API_ADDRESS}${address}&tag=latest&apiKey=${key}`,
  );

  const request = async () => {
    const response = await tokenBalance;

    if (response.data.status === '1' && response.data.message === 'OK') {
      return Utils.Checkers.decNum(response.data.result, 18);
    } else {
      Utils.ThrowError(response.data.result);
    }
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
    const erc20List = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TXLIST}${ETHERSCAN_API_ADDRESS}${address}&startblock=0&endblock=99999999&sort=asc&apikey=${key}`,
    );

    const responseData = async () => {
      const data = await erc20List;

      return data;
    };

    let allTransactions = {
      In: [],
      Out: [],
    };

    let makeTransaction = (element: {
      timeStamp: any;
      contractAddress: any;
      tokenName: any;
      tokenSymbol: any;
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

    return responseData().then(res => {
      res.data.result.forEach((element: any) => {
        if (element.to === address.toLowerCase()) {
          allTransactions.In = [...allTransactions.In, makeTransaction(element)];
        } else {
          allTransactions.Out = [...allTransactions.Out, makeTransaction(element)];
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
      return Utils.Checkers.decNum(response.data.result, 18);
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
function templatePriceToken(startData: any, finalArray: any[], key: string) {
  const timeout = i =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            GetPriceToken({ tokenSymbol: i.symbol, timestamp: i.date }, key)
              .then((item: number) => {
                if (item !== null) {
                  finalArray = [
                    ...finalArray,
                    {
                      Name: i.name,
                      Eth: item * i.value,
                      Symbol: i.symbol,
                      Date: i.date,
                    },
                  ];
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
    return finalArray;
  });
}

/**
 * Get In Transactions by address
 * @param address string
 * @returns {Promise} Promise with object in transactions
 */
export function GetInTransactions(address: EthAddress, key: string): Promise<any> {
  const resultObject = {
    title: 'In',
    data: [],
  };

  return GetAllTransactions(address, key).then((res: { In: any }) => {
    return templatePriceToken(res.In, resultObject.data, key);
  });
}

/**
 * Get Out Transactions by address
 * @param address string
 * @returns {Promise} Promise with object out transactions
 */
export function GetOutTransactions(address: EthAddress, key: string): Promise<any> {
  const resultObject = {
    title: 'Out',
    data: [],
  };

  return GetAllTransactions(address, key).then((res: { Out: any }) => {
    return templatePriceToken(res.Out, resultObject.data, key);
  });
}

export function GetResultErc20Transactions(address: EthAddress, key: string) {
  const outSum = GetOutTransactions(address, key);
  const inSum = GetInTransactions(address, key);

  return Promise.all([outSum, inSum]).then(result => {
    let outTransactions = SumTransactions(result[0]);
    let inTransactions = SumTransactions(result[1]);

    let obj = {};

    Object.keys(outTransactions).map(a => {
      obj[a] = outTransactions[a] - inTransactions[a];
    });

    return obj;
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

  /**
   * TODO: Change function to sum only numeric values
   */
  arr.reduce((acc: any, curr: any) => {
    const key = curr.Symbol;

    if (!resultObj[key]) {
      resultObj = {
        ...resultObj,
        [key]: curr.Eth,
      };
      acc.push(resultObj);
    } else {
      resultObj[key] += curr.Eth;
    }

    return acc;
  }, []);

  return resultObj;
}
