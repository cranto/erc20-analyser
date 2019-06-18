import { GetCurrentPriceToken, GetAllTransactions, GetCurrentERC20TokenBalance, GetPriceToken } from './index';
import { EthAddress } from '../interfaces';
import { PromiseQueue, ThrowError } from '../utils';

/**
 * Function to get amount of all transactions
 * @param arr Array with transactions
 */
export function GetAmount(arr: any[]): object {
  let result = {};

  arr.reduce((acc: any, curr: any) => {
    if (curr === undefined) {
      return acc;
    }

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
  let tokenInfo = value => {
    return GetPriceToken({ tokenSymbol: value.symbol, timestamp: value.date }, key).then(item => {
      if (item !== null && item !== undefined) {
        return {
          ...value,
          eth: item * value.value,
          withdraw: item * value.value - value.gasUsed,
        };
      }
    });
  };

  return PromiseQueue(startData, tokenInfo, 500);
}

/**
 * Get Out Transactions by address
 * @param address string
 * @returns {Promise} Promise with object out transactions
 */
export async function GetOutTransactions(address: EthAddress, key: string): Promise<any> {
  const res = await GetAllTransactions(address, key);
  return templatePriceToken(res.Out, key);
}

/**
 * Get In Transactions by address
 * @param address string
 * @returns {Promise} Promise with object in transactions
 */
export async function GetInTransactions(address: EthAddress, key: string): Promise<any> {
  const res = await GetAllTransactions(address, key);
  return templatePriceToken(res.In, key);
}

/**
 * Function to get result of token buy/sell
 * @param address {string}
 * @param etherscanKey {string}
 * @returns {Promise}
 */
export async function GetResultErc20Transactions(address: EthAddress, etherscanKey: string): Promise<object> {
  return GetAllTransactions(address, etherscanKey).then(r => {
    const inSum = templatePriceToken(r.In, etherscanKey);
    const outSum = templatePriceToken(r.Out, etherscanKey);

    const objResult = async () => {
      try {
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
      } catch (err) {
        ThrowError(err);
      }
    };

    return objResult();
  });
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
  return GetResultErc20Transactions(address, etherscanKey).then(response => {
    const responseObj = Object.values(response);

    let tokenCurrent = i => {
      return GetCurrentERC20TokenBalance(address, i.contractAddress, etherscanKey).then(r => {
        return GetCurrentPriceToken(i.symbol, 'ETH', cryptocompareKey).then(price => {
          if (price !== null && price !== undefined) {
            return {
              [i.symbol]: i.withdraw + r * price,
            };
          }
        });
      });
    };

    return PromiseQueue(responseObj, tokenCurrent, 500);
  });
}
