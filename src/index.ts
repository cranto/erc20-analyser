import { GetAllTransactions, GetCurrentEthBalance, GetOutTransactions, GetInTransactions } from './core/etherscan';
import { GetPriceToken } from './core/cryptocompare';
import { EthAddress, IPriceToken } from './interfaces';
import * as Utils from './utils';

export class ERC20Analyser {
  protected _configuration: Utils.Configuration;

  public constructor(cryptocompareKey: string, etherscanKey: string) {
    this._configuration = new Utils.Configuration(cryptocompareKey, etherscanKey);
  }

  /**
   * Function to get all transactions of ERC-20 tokens by address
   */
  public getAllTransactions = (address: EthAddress) => GetAllTransactions(address, this._configuration.etherscanKey);

  /**
   * Function to get current balance of ETH
   */
  public getCurrentEthBalance = (address: EthAddress) =>
    GetCurrentEthBalance(address, this._configuration.etherscanKey);

  /**
   * Function to get outgoing transactions by address
   */
  public getOutTransactions = (address: EthAddress) =>
    GetOutTransactions(address, this._configuration.cryptocompareKey);

  /**
   * Function to get incoming transactions by address
   */
  public getInTransactions = (address: EthAddress) => GetInTransactions(address, this._configuration.cryptocompareKey);

  /**
   * Function for get token price by date
   *
   * @param tokenSymbol {string} To start
   * @param timestamp {string | number} Unix Timestamp
   * @param toConvert {string} Default: ETH
   */
  public getPriceToken = (obj: IPriceToken) => GetPriceToken(obj, this._configuration.cryptocompareKey);
}
