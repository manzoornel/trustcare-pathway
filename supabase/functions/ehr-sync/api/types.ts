
/**
 * Common types for the EHR API integration
 */

export interface EhrApiConfig {
  api_endpoint: string;
  api_key: string;
  is_active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LabReport {
  ehrReferenceId: string;
  date: string;
  type: string;
  doctor: string;
  status: string;
  results: LabResult[];
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
}

export interface Medication {
  ehrReferenceId: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribed: string;
  doctor: string;
}

export interface Appointment {
  ehrReferenceId: string;
  type: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  location: string;
}

export interface MedicalSummary {
  ehrReferenceId: string;
  type: string;
  date: string;
  doctor: string;
  notes: string;
}

export interface Visit {
  id: string;
  type: string;
  date: string;
  doctor: string;
  notes: string;
}

export interface EhrData {
  labReports: LabReport[];
  medications: Medication[];
  appointments: Appointment[];
  medicalSummaries: MedicalSummary[];
  visits?: Visit[];
}
