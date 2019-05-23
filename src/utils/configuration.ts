export class Configuration {
  public etherscanKey: string;
  public cryptocompareKey: string;

  constructor(etherscanKey: string, cryptocompare: string) {
    this.etherscanKey = etherscanKey;
    this.cryptocompareKey = cryptocompare;
  }
}
