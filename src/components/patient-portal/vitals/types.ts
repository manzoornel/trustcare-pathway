
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
