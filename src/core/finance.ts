import { IROIValues } from '../interfaces';

/**
 * Return on Investment (ROI)
 * ROI is a ratio between the net profit and cost of investment resulting from an investment of some resources
 * @param {object} data
 * @returns {number}
 */
export function calculateROI(data: IROIValues): number {
  /**
   * ROI = (Current value of investment - cost of investments) / cost of investment
   */
  let result = ((data.cvoi - data.coi) / data.coi) * 100;

  return result;
}

/**
 * Sharpe ratio
 * Sharpe ratio is a way to examine the performance of an investment by adjusting for its risk.
 *
 * @param data
 * @returns {number}
 */
export function calculateSharpeRatio(data: any): number {
  return data;
}
