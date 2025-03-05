
// Helper function to determine if a value is within normal range
export const isWithinRange = (value: number, range: string): boolean => {
  // Handle ranges with a single boundary like "<200" or ">40"
  if (range.startsWith("<")) {
    const upperLimit = parseFloat(range.substring(1));
    return value < upperLimit;
  }
  if (range.startsWith(">")) {
    const lowerLimit = parseFloat(range.substring(1));
    return value > lowerLimit;
  }

  // Handle ranges with both lower and upper bounds like "13.5-17.5"
  const [lowerStr, upperStr] = range.split("-");
  const lower = parseFloat(lowerStr);
  const upper = parseFloat(upperStr);
  return value >= lower && value <= upper;
};

// Helper function to get the percentage change between two values
export const getPercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
