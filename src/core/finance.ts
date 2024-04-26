interface Roi {
  cvoi: number // Current value of investment
  coi: number // Cost of investment
}

/**
 * Return on Investment (ROI)
 * ROI is a ratio between the net profit and cost of investment resulting from an investment of some resources
 */
export function calculateROI(data: Roi): number {
  /**
   * ROI = (Current value of investment - cost of investments) / cost of investment
   */
  return ((data.cvoi - data.coi) / data.coi) * 100;
}


export class Finance {
  /**
   * Return on Investment (ROI)
   * ROI is a ratio between the net profit and cost of investment resulting from an investment of some resources
   */
  public calculateROI(
    roi: Roi
  ): number {
    return ((roi.cvoi - roi.coi) / roi.coi) * 100
  }

  /**
   * TODO: Implement Sharpe Ratio
   * The Sharpe ratio compares the return of an investment (ROI) with its risk.
   * https://www.investopedia.com/terms/s/sharperatio.asp
   */
}
