import { CRYPTOCOMPARE_API } from '../constants';
import * as Utils from '../utils';
import { IPriceToken } from '../interfaces';

/**
 * Function for get token price by date
 *
 * @param tokenSymbol {string} To start
 * @param timestamp {string | number} Unix Timestamp
 * @param toConvert {string} Default: ETH
 * @returns {Promise} Promise object represents the answer about convert A-currency (ERC20 Token) to B-currency
 */
export function GetPriceToken(options: IPriceToken, key: string): Promise<any> {
  let localTimestamp = options.timestamp;
  const toCryptoCurrency = options.toConvert ? options.toConvert.toUpperCase() : 'ETH';
  const startCurrency = options.tokenSymbol.toUpperCase();

  /**
   * If you post incorrect timestamp with letters,
   * function will remove letter and return value
   * before first letter
   *
   * For example:
   * 1. 1555505512a -> 1555505512
   * 2. 15a55505512 -> 15
   */
  if (typeof options.timestamp === 'string') {
    localTimestamp = Number(options.timestamp);
  }

  /**
   * TODO: Adding function for escape symbols for emoji's
   */

  const responseData = async () => {
    try {
      const res = await Utils.Request(
        `${CRYPTOCOMPARE_API}pricehistorical?fsym=${startCurrency}&tsyms=${toCryptoCurrency}&ts=${localTimestamp}&api_key={${key}}`,
      );

      const dataInformation = await res;

      if (dataInformation.data.Response === 'Error') {
        return null;
      }

      return dataInformation.data[startCurrency][toCryptoCurrency];
    } catch (error) {
      Utils.ThrowError(error);
    }
  };

  return responseData();
}

export function GetCurrentPriceToken(token: string, toCryptoCurrency: string, key: string) {
  const responseData = async () => {
    try {
      const res = await Utils.Request(
        `${CRYPTOCOMPARE_API}price?fsym=${token}&tsyms=${toCryptoCurrency}&api_key={${key}}`,
      );

      const dataInformation = await res;

      if (dataInformation.data.Response === 'Error') {
        return null;
      }

      return dataInformation.data[toCryptoCurrency];
    } catch (error) {
      Utils.ThrowError(error);
    }
  };

  return responseData();
}
