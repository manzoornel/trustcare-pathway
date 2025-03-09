
export interface VitalRecord {
  id: string;
  date: string; 
  patientId: string;
  type: VitalType;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  recordedBy: string;
  notes?: string;
}

export type VitalType = 
  | "blood_pressure" 
  | "heart_rate" 
  | "temperature" 
  | "respiratory_rate" 
  | "oxygen_saturation" 
  | "blood_glucose" 
  | "weight";

export interface VitalTypeInfo {
  type: VitalType;
  label: string;
  unit: string;
  icon: string;
  normalRange: string;
  description: string;
}

export const vitalTypes: VitalTypeInfo[] = [
  {
    type: "blood_pressure",
    label: "Blood Pressure",
    unit: "mmHg",
    icon: "activity",
    normalRange: "90/60 - 120/80",
    description: "Pressure of blood against artery walls"
  },
  {
    type: "heart_rate",
    label: "Heart Rate",
    unit: "bpm",
    icon: "heart-pulse",
    normalRange: "60 - 100",
    description: "Number of heartbeats per minute"
  },
  {
    type: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: "thermometer",
    normalRange: "36.1 - 37.2",
    description: "Body temperature"
  },
  {
    type: "respiratory_rate",
    label: "Respiratory Rate",
    unit: "bpm",
    icon: "activity",
    normalRange: "12 - 20",
    description: "Number of breaths per minute"
  },
  {
    type: "oxygen_saturation",
    label: "Oxygen Saturation",
    unit: "%",
    icon: "activity",
    normalRange: "95 - 100",
    description: "Percentage of oxygen-saturated hemoglobin"
  },
  {
    type: "blood_glucose",
    label: "Blood Glucose",
    unit: "mg/dL",
    icon: "activity",
    normalRange: "80 - 130",
    description: "Blood sugar level"
  },
  {
    type: "weight",
    label: "Weight",
    unit: "kg",
    icon: "activity",
    normalRange: "varies",
    description: "Body weight"
  }
];

export const mockVitalsData: VitalRecord[] = [
  // Blood Pressure Records - 10 entries with different dates
  {
    id: "v1",
    date: "2024-10-15",
    patientId: "p001",
    type: "blood_pressure",
    value: 120,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Normal reading, systolic 120, diastolic 80"
  },
  {
    id: "v2",
    date: "2024-10-05",
    patientId: "p001",
    type: "blood_pressure",
    value: 125,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK",
    notes: "Slight increase, systolic 125, diastolic 82"
  },
  {
    id: "v3",
    date: "2024-09-25",
    patientId: "p001",
    type: "blood_pressure",
    value: 135,
    unit: "mmHg",
    status: "warning",
    recordedBy: "Dr. Wazeem",
    notes: "Elevated, systolic 135, diastolic 88"
  },
  {
    id: "v13",
    date: "2024-09-15",
    patientId: "p001",
    type: "blood_pressure",
    value: 132,
    unit: "mmHg",
    status: "warning",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Slightly elevated, systolic 132, diastolic 85"
  },
  {
    id: "v14",
    date: "2024-09-05",
    patientId: "p001",
    type: "blood_pressure",
    value: 128,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK",
    notes: "Improving, systolic 128, diastolic 83"
  },
  {
    id: "v15",
    date: "2024-08-25",
    patientId: "p001",
    type: "blood_pressure",
    value: 138,
    unit: "mmHg",
    status: "warning",
    recordedBy: "Dr. Wazeem",
    notes: "Elevated, systolic 138, diastolic 89"
  },
  {
    id: "v16",
    date: "2024-08-15",
    patientId: "p001",
    type: "blood_pressure",
    value: 142,
    unit: "mmHg",
    status: "critical",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "High, systolic 142, diastolic 92, medication adjustment recommended"
  },
  {
    id: "v17",
    date: "2024-08-05",
    patientId: "p001",
    type: "blood_pressure",
    value: 122,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK",
    notes: "Normal, systolic 122, diastolic 80"
  },
  {
    id: "v18",
    date: "2024-07-25",
    patientId: "p001",
    type: "blood_pressure",
    value: 118,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Wazeem",
    notes: "Excellent, systolic 118, diastolic 78"
  },
  {
    id: "v19",
    date: "2024-07-15",
    patientId: "p001",
    type: "blood_pressure",
    value: 124,
    unit: "mmHg",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Normal, systolic 124, diastolic 82"
  },
  
  // Heart Rate Records
  {
    id: "v4",
    date: "2024-10-10",
    patientId: "p001",
    type: "heart_rate",
    value: 72,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  {
    id: "v5",
    date: "2024-09-20",
    patientId: "p001",
    type: "heart_rate",
    value: 78,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v6",
    date: "2024-09-01",
    patientId: "p001",
    type: "heart_rate",
    value: 68,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v20",
    date: "2024-08-20",
    patientId: "p001",
    type: "heart_rate",
    value: 82,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Slightly elevated but within normal range"
  },
  {
    id: "v21",
    date: "2024-08-01",
    patientId: "p001",
    type: "heart_rate",
    value: 64,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK",
    notes: "Lower than usual but healthy"
  },
  {
    id: "v22",
    date: "2024-07-20",
    patientId: "p001",
    type: "heart_rate",
    value: 76,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v23",
    date: "2024-07-01",
    patientId: "p001",
    type: "heart_rate",
    value: 92,
    unit: "bpm",
    status: "warning",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Elevated, patient reported feeling anxious"
  },
  {
    id: "v24",
    date: "2024-06-20",
    patientId: "p001",
    type: "heart_rate",
    value: 74,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v25",
    date: "2024-06-01",
    patientId: "p001",
    type: "heart_rate",
    value: 70,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v26",
    date: "2024-05-20",
    patientId: "p001",
    type: "heart_rate",
    value: 68,
    unit: "bpm",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  
  // Temperature Records
  {
    id: "v7",
    date: "2024-10-10",
    patientId: "p001",
    type: "temperature",
    value: 36.8,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  {
    id: "v8",
    date: "2024-09-20",
    patientId: "p001",
    type: "temperature",
    value: 37.2,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v9",
    date: "2024-09-01",
    patientId: "p001",
    type: "temperature",
    value: 38.1,
    unit: "°C",
    status: "warning",
    recordedBy: "Dr. Wazeem",
    notes: "Slight fever"
  },
  {
    id: "v27",
    date: "2024-08-20",
    patientId: "p001",
    type: "temperature",
    value: 37.5,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Higher end of normal range"
  },
  {
    id: "v28",
    date: "2024-08-01",
    patientId: "p001",
    type: "temperature",
    value: 36.5,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v29",
    date: "2024-07-20",
    patientId: "p001",
    type: "temperature",
    value: 37.0,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v30",
    date: "2024-07-01",
    patientId: "p001",
    type: "temperature",
    value: 38.5,
    unit: "°C",
    status: "warning",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Fever, prescribed antipyretics"
  },
  {
    id: "v31",
    date: "2024-06-20",
    patientId: "p001",
    type: "temperature",
    value: 36.9,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v32",
    date: "2024-06-01",
    patientId: "p001",
    type: "temperature",
    value: 37.1,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v33",
    date: "2024-05-20",
    patientId: "p001",
    type: "temperature",
    value: 36.7,
    unit: "°C",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  
  // Oxygen Saturation Records
  {
    id: "v10",
    date: "2024-10-10",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 98,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  {
    id: "v11",
    date: "2024-09-20",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 97,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v12",
    date: "2024-09-01",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 94,
    unit: "%",
    status: "warning",
    recordedBy: "Dr. Wazeem",
    notes: "Slightly below normal range"
  },
  {
    id: "v34",
    date: "2024-08-20",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 96,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  },
  {
    id: "v35",
    date: "2024-08-01",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 99,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK",
    notes: "Excellent saturation"
  },
  {
    id: "v36",
    date: "2024-07-20",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 97,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v37",
    date: "2024-07-01",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 93,
    unit: "%",
    status: "warning",
    recordedBy: "Dr. Manzoor Nellancheri",
    notes: "Lower than usual, patient reported mild shortness of breath"
  },
  {
    id: "v38",
    date: "2024-06-20",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 95,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Shameem Samad PK"
  },
  {
    id: "v39",
    date: "2024-06-01",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 96,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Wazeem"
  },
  {
    id: "v40",
    date: "2024-05-20",
    patientId: "p001",
    type: "oxygen_saturation",
    value: 98,
    unit: "%",
    status: "normal",
    recordedBy: "Dr. Manzoor Nellancheri"
  }
];

// Helper function to get vital records by type
export const getVitalsByType = (type: VitalType): VitalRecord[] => {
  return mockVitalsData
    .filter(record => record.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper function to get vital type info
export const getVitalTypeInfo = (type: VitalType): VitalTypeInfo => {
  return vitalTypes.find(vt => vt.type === type) || vitalTypes[0];
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
