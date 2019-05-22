export type EthAddress = string;

export interface IPriceToken {
  /** Token abbreviation */
  tokenSymbol: string;

  /** Date for moment */
  timestamp: string | number;

  /** Convert to currency */
  toConvert?: string;
}
