import * as Core from './core';
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
  public getAllTransactions = (address: EthAddress) =>
    Core.GetAllTransactions(address, this._configuration.etherscanKey);

  /**
   * Function to get current balance of ETH
   */
  public getCurrentEthBalance = (address: EthAddress) =>
    Core.GetCurrentEthBalance(address, this._configuration.etherscanKey);

  /**
   * Function to get outgoing transactions by address
   */
  public getOutTransactions = (address: EthAddress) =>
    Core.GetOutTransactions(address, this._configuration.cryptocompareKey);

  /**
   * Function to get incoming transactions by address
   */
  public getInTransactions = (address: EthAddress) =>
    Core.GetInTransactions(address, this._configuration.cryptocompareKey);

  /**
   * Function for get token price by date
   *
   * @param tokenSymbol {string} To start
   * @param timestamp {string | number} Unix Timestamp
   * @param toConvert {string} Default: ETH
   */
  public getPriceToken = (obj: IPriceToken) => Core.GetPriceToken(obj, this._configuration.cryptocompareKey);

  /**
   * Function returns all incoming and outgoing transactions
   */
  public getResultErc20Transactions = (address: EthAddress) =>
    Core.GetResultErc20Transactions(address, this._configuration.cryptocompareKey);

  /**
   * TODO: all transactions
   */
  public sumTransactions = (arr: []) => Core.SumTransactions(arr);

  /**
   * TODO: update logic of this function
   */
  public getCurrentERC20TokenBalance = (address, contract) =>
    Core.GetCurrentERC20TokenBalance(address, contract, this._configuration.etherscanKey);
}
