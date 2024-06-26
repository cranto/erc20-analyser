export type EthAddress = string;

export interface IEtherscanRequest {
  data: {
    status: string;
    message: string;
    result: object;
  };
}

export interface IPriceToken {
  /** Token abbreviation */
  tokenSymbol: string;

  /** Date for moment */
  timestamp: string | number;

  /** Convert to currency */
  toConvert?: string;
}
