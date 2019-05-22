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
export function GetAllTransactions(address: EthAddress): any {
  if (CheckAddress(address)) {
    const erc20List = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_TXLIST}${ETHERSCAN_API_ADDRESS}${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
    );

    const responseData = async () => {
      const dataInfo = await erc20List;

      return dataInfo;
    };

    return responseData().then(res => {
      const allTransactions = {
        In: [],
        Out: [],
      };
      res.data.result.forEach((element: any) => {
        if (element.to === address.toLowerCase()) {
          allTransactions.In = [
            ...allTransactions.In,
            {
              date: Utils.ToTimestamp.ToDate(element.timeStamp),
              name: [element.tokenName],
              symbol: [element.tokenSymbol],
              value: decNum(element.value),
            },
          ];
        } else {
          allTransactions.Out = [
            ...allTransactions.Out,
            {
              date: Utils.ToTimestamp.ToDate(element.timeStamp),
              name: [element.tokenName],
              symbol: [element.tokenSymbol],
              value: decNum(element.value),
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
export function GetCurrentEthBalance(address: EthAddress): any {
  if (CheckAddress(address)) {
    const res = Utils.Request(
      `${ETHERSCAN_API}${ETHERSCAN_API_ACCOUNT}${ETHERSCAN_API_BALANCE}${ETHERSCAN_API_ADDRESS}${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`,
    );

    const responseData = async () => {
      const dataInfo = await res;

      return dataInfo;
    };

    return responseData().then(response => {
      return decNum(response.data.result);
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
  const timeout = i =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve(
            GetPriceToken({ tokenSymbol: i.symbol[0], timestamp: i.date })
              .then((item: number) => {
                if (item !== null) {
                  finalArray = [
                    ...finalArray,
                    {
                      Name: i.name[0],
                      Eth: item * i.value,
                      Symbol: i.symbol[0],
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

  return asyncPool(2, startData, timeout).then(() => {
    return finalArray;
  });
}

/**
 * Get In Transactions by address
 * @param address string
 * @returns {Promise} Promise with object in transactions
 */
export function GetInTransactions(address: EthAddress): Promise<any> {
  const arrayInTransactions = [];

  return GetAllTransactions(address).then((res: { In: any }) => {
    return templatePriceToken(res.In, arrayInTransactions);
  });
}

/**
 * Get Out Transactions by address
 * @param address string
 * @returns {Promise} Promise with object out transactions
 */
export function GetOutTransactions(address: EthAddress): Promise<any> {
  const arrayOutTransactions = [];

  return GetAllTransactions(address).then((res: { Out: any }) => {
    return templatePriceToken(res.Out, arrayOutTransactions);
  });
}

export function GetResultErc20Transactions(address: EthAddress) {
  const outSum = GetOutTransactions(address);
  const inSum = GetInTransactions(address);

  return Promise.all([outSum, inSum]).then(r => {
    return r;
  });
}

/**
 * Function for sum all similar transcations
 */
function sumErc20Transactions(arr: any) {
  const resultObj = {};

  arr.reduce((acc: any, curr: any) => {
    const key = curr.Symbol;

    if (!resultObj[key]) {
      resultObj[key] = curr;
      acc.push(resultObj[key]);
    } else {
      resultObj[key].Eth += curr.Eth;
    }

    return acc;
  }, []);

  return resultObj;
}
