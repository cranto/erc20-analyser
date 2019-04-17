import { request } from '../utils/request';
import ThrowError from '../utils/throw-error';
import { CRYPTOCOMPARE_API_KEY, CRYPTOCOMPARE_API } from '../constants';

/**
 * Function for token price by date
 *
 * @param tokenSymbol {string} To start
 * @param timestamp {string | number} Unix Timestamp
 * @param toConvert {string} Default: ETH
 * @returns {Promise} Promise object represents the answer about convert A-currency (ERC20 Token) to B-currency
 */
export function GetPriceToken(tokenSymbol: string, timestamp: string | number, toConvert?: string): any {
  let localTimestamp = timestamp;
  let toCryptoCurrency = 'ETH';
  let startCurrency = tokenSymbol.toUpperCase();

  /**
   * If you post incorrect timestamp with letters,
   * function will remove letter and return value
   * before first letter
   *
   * For example:
   * 1. 1555505512a -> 1555505512
   * 2. 15a55505512 -> 15
   */
  if (typeof timestamp === 'string') {
    localTimestamp = parseInt(timestamp);
  }

  if (toConvert) {
    toCryptoCurrency = toConvert.toUpperCase();
  }

  const res = request(
    `${CRYPTOCOMPARE_API}pricehistorical?fsym=${startCurrency}&tsyms=${toCryptoCurrency}&ts=${localTimestamp}&api_key={${CRYPTOCOMPARE_API_KEY}}`,
  );

  const responseData = async () => {
    let dataInformation = await res;

    if (dataInformation.data.Response === 'Error') {
      return ThrowError(dataInformation.data.Message);
    }

    return dataInformation.data[startCurrency][toCryptoCurrency];
  };

  return responseData();
}
