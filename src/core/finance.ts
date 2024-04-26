import { IROIValues } from '../interfaces';

/**
 * Return on Investment (ROI)
 * ROI is a ratio between the net profit and cost of investment resulting from an investment of some resources
 */
export function calculateROI(data: IROIValues): number {
  /**
   * ROI = (Current value of investment - cost of investments) / cost of investment
   */
  return ((data.cvoi - data.coi) / data.coi) * 100;
}

/**
 * Sharpe ratio
 * The Sharpe ratio compares the return of an investment (ROI) with its risk.
 *
 * https://www.investopedia.com/terms/s/sharperatio.asp
 *
 * @param data
 * @returns {any}
 */
export function calculateSharpeRatio<T>(data: T): T {
  return data;
}
