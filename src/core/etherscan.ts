import { EthAddress, IEtherscanRequest } from '../interfaces';
import CheckAddress from '../utils/check-address';
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
    const responseBalance = checkCorrectRequest(await tokenBalanceReq);

    /**
     * Get token decimal information
     */
    const responseDecimal = checkCorrectRequest(await tokenDecimalReq);

    const tokenDecimal = 'tokenDecimal';

    /**
     * Check type of response and return decimal information
     */
    const decimalAns = Array.isArray(responseDecimal)
      ? responseDecimal[0][tokenDecimal]
      : responseDecimal[tokenDecimal];

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

    const allTransactions = {
      In: [],
      Out: [],
    };

    const formationTransactionObj = (element: {
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
