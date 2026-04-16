export interface DataPoint {
  date: string;
  value: number | null;
  examType: string;
  examId: string;
}

export interface DataPointWithOutlier extends DataPoint {
  isOutlier: boolean;
  zScore?: number;
}

export interface OutlierStats {
  mean: number;
  stdDev: number;
  threshold: number;
}

export const statsService = {
  /**
   * Calculates the mean of an array of numbers
   * @param values an array of numbers
   * @returns the average of the input array
   */
  calculateMean: (values: number[]): number => {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  },
  /**
   * Calculates the standard deviation of an array of numbers
   * @param values an array of numbers
   * @param mean the mean to be used for calculating std deviation
   * @returns the standard deviation of the input array
   */
  calculateStdDev: (values: number[], mean: number): number => {
    if (values.length < 2) return 0;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  },
  // TODO
  detectOutliers: () => {
    return "Not yet implemented";
  },
  // TODO
  detectArmCareOutliers: () => {
    return "Not yet implemented";
  },
};
