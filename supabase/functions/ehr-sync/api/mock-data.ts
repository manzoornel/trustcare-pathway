
import { EhrData } from "./types.ts";
import { getMockLabReports } from "./data-services/lab-service.ts";
import { getMockMedications } from "./data-services/medication-service.ts";
import { getMockAppointments } from "./data-services/appointment-service.ts";
import { getMockMedicalSummaries } from "./data-services/visit-service.ts";

/**
 * Fallback function that returns mock data
 * @param patientId The patient ID to generate mock data for
 */
export function getMockEhrData(patientId?: string): EhrData {
  console.log(`Generating mock data${patientId ? ` for patient ${patientId}` : ''} due to API error`);
  
  return {
    labReports: getMockLabReports(),
    medications: getMockMedications(),
    appointments: getMockAppointments(),
    medicalSummaries: getMockMedicalSummaries()
  };
}
