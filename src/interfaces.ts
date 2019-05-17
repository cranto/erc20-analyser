export type address = string;

export interface PriceToken {
  /** Token abbreviation */
  tokenSymbol: string;

  /** Date for moment */
  timestamp: string | number;

  /** Convert to currency */
  toConvert?: string;
}
