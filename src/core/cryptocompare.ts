import { CRYPTOCOMPARE_API } from '../constants';
import * as Utils from '../utils';
import { IPriceToken } from '../interfaces';

function checkCorrectRequest(res) {
  if (res.data.Response === 'Error') {
    return null;
  } else {
    return res.data;
  }
}

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

  if (typeof options.timestamp === 'string') {
    localTimestamp = Number(options.timestamp);
  }

  const response = async () => {
    try {
      const res = await Utils.WrapperRequest(
        `${CRYPTOCOMPARE_API}pricehistorical?fsym=${startCurrency}&tsyms=${toCryptoCurrency}&ts=${localTimestamp}&api_key={${key}}`,
      );

      const data = checkCorrectRequest(res);

      return data[startCurrency][toCryptoCurrency];
    } catch (error) {
      Utils.ThrowError(error);
    }
  };

  return response();
}

export function GetCurrentPriceToken(token: string, toCryptoCurrency: string, key: string) {
  const response = async () => {
    try {
      const res = await Utils.WrapperRequest(
        `${CRYPTOCOMPARE_API}price?fsym=${token}&tsyms=${toCryptoCurrency}&api_key={${key}}`,
      );

      const data = checkCorrectRequest(res);

      return data[toCryptoCurrency];
    } catch (error) {
      Utils.ThrowError(error);
    }
  };

  return response();
}
