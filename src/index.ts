import * as Core from './core';
import { EthAddress, IPriceToken } from './interfaces';
import * as Utils from './utils';

export class ERC20Analyser {
  // tslint:disable-next-line: variable-name
  protected _configuration: Utils.Configuration;

  public constructor(cryptocompareKey: string, etherscanKey: string, web3Provider: string) {
    this._configuration = new Utils.Configuration(cryptocompareKey, etherscanKey, web3Provider);
  }

  /**
   * Function to get current balance of ETH
   */
  public getCurrentETHBalance = (address: string) => Core.GetCurrentETHBalance(address, this._configuration.web3);

  /**
   * Function to get all transactions of ERC-20 tokens by address
   */
  public getAllTransactions = (address: EthAddress) =>
    Core.GetAllTransactions(address, this._configuration.etherscanKey);

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
   * Function return sum of incoming and outcoming transactions
   * But function does not take into account the current hold
   */
  public getResultERC20Transactions = (address: EthAddress) =>
    Core.GetResultErc20Transactions(address, this._configuration.etherscanKey);

  /**
   * Function to get current price token
   * Example:
   * ERC20Analyser.getCurrentPriceToken('BNB', 'ETH').then(response => {
   *  console.log(response); // return number
   * })
   */
  public getCurrentPriceToken = (tokenName: string, toCryptoCurrency: string) =>
    Core.GetCurrentPriceToken(tokenName, toCryptoCurrency, this._configuration.cryptocompareKey);

  /**
   * Function to get current token balance by contract address
   */
  public getCurrentERC20TokenBalance = (address: string, contract: string) =>
    Core.GetCurrentERC20TokenBalance(address, contract, this._configuration.etherscanKey);

  /**
   * Function to get all balance (with hold)
   */
  public getERC20TokenBalanceWithHold = (address: string) =>
    Core.GetERC20TokenBalanceWithHold(address, this._configuration.etherscanKey, this._configuration.cryptocompareKey);

  public calculateROI = (cvoi, coi) => Core.GetROI({ cvoi, coi });
}
