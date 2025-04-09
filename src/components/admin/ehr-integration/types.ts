
export type EHRConfig = {
  id: string;
  api_endpoint: string;
  api_key: string;
  is_active: boolean;
  last_sync_time: string | null;
};

export type TestResult = {
  success: boolean;
  message: string;
} | null;

export interface EHRSyncHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'in_progress';
  message: string;
  patient_id?: string;
  details?: string;
}

export interface EHRLabReport {
  ehrReferenceId: string;
  date: string;
  type: string;
  doctor: string;
  status: string;
  results: EHRLabResult[];
}

export interface EHRLabResult {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
}

export interface EHRMedication {
  ehrReferenceId: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribed: string;
  doctor: string;
}

export interface EHRAppointment {
  ehrReferenceId: string;
  type: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  location: string;
}

export interface EHRMedicalSummary {
  ehrReferenceId: string;
  type: string;
  date: string;
  doctor: string;
  notes: string;
}

export interface EHRData {
  labReports: EHRLabReport[];
  medications: EHRMedication[];
  appointments: EHRAppointment[];
  medicalSummaries: EHRMedicalSummary[];
}
