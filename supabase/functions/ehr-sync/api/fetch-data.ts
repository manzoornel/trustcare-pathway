
import { EhrData, EhrApiConfig } from "./types.ts";
import { fetchLabReports, getMockLabReports } from "./data-services/lab-service.ts";
import { fetchMedications, getMockMedications } from "./data-services/medication-service.ts";
import { fetchAppointments, getMockAppointments } from "./data-services/appointment-service.ts";
import { fetchVisits, visitsToMedicalSummaries, getMockMedicalSummaries } from "./data-services/visit-service.ts";
import { fetchPatientDemographics } from "./data-services/patient-service.ts";

/**
 * Fetch data from EHR API
 * @param patientId The patient ID to fetch data for
 * @param ehrConfig The EHR API configuration
 */
export async function fetchEhrData(patientId: string, ehrConfig: EhrApiConfig): Promise<EhrData> {
  console.log(`Fetching data for patient: ${patientId} from EHR API at: ${ehrConfig.api_endpoint}`);
  
  try {
    // First verify that the patient exists in the EHR system
    const patientExists = await fetchPatientDemographics(patientId, ehrConfig);
    
    if (!patientExists) {
      throw new Error(`Patient with ID ${patientId} not found in EHR system or access denied`);
    }
    
    // Fetch visits first as we'll need them for lab reports and medications
    const visits = await fetchVisits(patientId, ehrConfig);
    
    // For each visit, fetch lab reports and medications in parallel
    const labReportsPromises = visits.map(visit => fetchLabReports(visit.id, ehrConfig));
    const medicationsPromises = visits.map(visit => fetchMedications(visit.id, ehrConfig));
    
    // Fetch appointments directly for the patient
    const appointmentsPromise = fetchAppointments(patientId, ehrConfig);
    
    // Wait for all API calls to complete
    const [allLabReports, allMedications, appointments] = await Promise.all([
      Promise.all(labReportsPromises),
      Promise.all(medicationsPromises),
      appointmentsPromise
    ]);
    
    // Flatten arrays of lab reports and medications
    const labReports = allLabReports.flat();
    const medications = allMedications.flat();
    
    // Convert visits to medical summaries
    const medicalSummaries = visitsToMedicalSummaries(visits);
    
    return {
      labReports,
      medications,
      appointments,
      medicalSummaries,
      visits
    };
  } catch (error) {
    console.error('Error fetching data from EHR:', error);
    
    // Return mock data in case of errors
    console.log('Using mock data as fallback due to error');
    return getMockEhrData();
  }
}

/**
 * Get mock EHR data when the API is unavailable
 */
export function getMockEhrData(): EhrData {
  console.log('Generating mock EHR data due to API error');
  
  return {
    labReports: getMockLabReports(),
    medications: getMockMedications(),
    appointments: getMockAppointments(),
    medicalSummaries: getMockMedicalSummaries()
  };
}
