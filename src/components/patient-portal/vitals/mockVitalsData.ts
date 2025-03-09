
import { VitalRecord } from "./types";

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
