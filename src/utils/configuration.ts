import Web3 from 'web3';

export class Configuration {
  public etherscanKey: string;
  public cryptocompareKey: string;
  public web3: Web3;

  constructor(etherscanKey: string, cryptocompare: string) {
    this.etherscanKey = etherscanKey;
    this.cryptocompareKey = cryptocompare;
    this.web3 = this.initWeb3();
  }

  public initWeb3() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b26732fc8a0648fbbca2099cde85a48f'),
    );

    return web3;
  }
}
