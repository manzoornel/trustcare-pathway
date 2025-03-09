
import { VitalRecord, VitalType } from "./types";
import { mockVitalsData } from "./mockVitalsData";

// Helper function to get vital records by type
export const getVitalsByType = (type: VitalType): VitalRecord[] => {
  return mockVitalsData
    .filter(record => record.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Function to determine status color class
export const getStatusColorClass = (status: VitalRecord['status']): string => {
  switch (status) {
    case 'normal':
      return 'text-green-600';
    case 'warning':
      return 'text-amber-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Function to get trend direction and icon
export const getTrendInfo = (records: VitalRecord[]) => {
  if (records.length < 2) return { direction: 'stable', icon: 'minus', class: 'text-gray-500' };
  
  const latest = records[0].value;
  const previous = records[1].value;
  
  if (latest > previous) {
    return { 
      direction: 'increasing', 
      icon: 'trending-up', 
      class: 'text-red-500' 
    };
  } else if (latest < previous) {
    return { 
      direction: 'decreasing', 
      icon: 'trending-down', 
      class: 'text-green-500' 
    };
  } else {
    return { 
      direction: 'stable', 
      icon: 'minus', 
      class: 'text-gray-500' 
    };
  }
};
