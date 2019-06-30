import Web3 from 'web3';

export class Configuration {
  public etherscanKey: string;
  public cryptocompareKey: string;
  public web3Provider: string;
  public web3: Web3;

  constructor(etherscanKey: string, cryptocompare: string, web3Provider: string) {
    this.etherscanKey = etherscanKey;
    this.cryptocompareKey = cryptocompare;
    this.web3Provider = web3Provider;
    this.web3 = this.initWeb3();
  }

  public initWeb3() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(this.web3Provider),
    );

    return web3;
  }
}
