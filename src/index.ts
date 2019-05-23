import { GetAllTransactions, GetCurrentEthBalance, GetOutTransactions, GetInTransactions } from './core/etherscan';
import { EthAddress } from './interfaces';
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
   * Function to get out transactions by address
   */
  public getOutTransactions = (address: EthAddress) =>
    GetOutTransactions(address, this._configuration.cryptocompareKey);

  /**
   * Function to get in transactions by address
   */
  public getInTransactions = (address: EthAddress) => GetInTransactions(address, this._configuration.cryptocompareKey);
}
