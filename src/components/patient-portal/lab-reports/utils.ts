
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

// Theme helper functions
export const getFestivalGreeting = (theme: string): string => {
  switch (theme) {
    case 'eid':
      return 'Eid Mubarak!';
    case 'onam':
      return 'Happy Onam!';
    case 'health':
      return 'Happy World Health Day!';
    case 'xmas':
      return 'Season\'s Greetings!';
    default:
      return 'Welcome back!';
  }
};

export const getFestivalMessage = (theme: string): string => {
  switch (theme) {
    case 'eid':
      return 'We wish you a blessed Eid. Remember to stay hydrated and maintain a balanced diet during festivities.';
    case 'onam':
      return 'Happy Onam! Enjoy the festivities while keeping your health in check.';
    case 'health':
      return 'On World Health Day, we remind you to prioritize your well-being. Schedule your annual check-up today!';
    case 'xmas':
      return 'Wishing you joy and good health this holiday season. Remember to stay warm and take care of yourself.';
    default:
      return '';
  }
};
