
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
  
  // Flag to track if we're using mock data due to errors
  let usingMockData = false;
  let errorReason = "";
  
  try {
    // First verify that the patient exists in the EHR system
    console.log(`Verifying patient exists: ${patientId}`);
    const patientExists = await fetchPatientDemographics(patientId, ehrConfig);
    
    if (!patientExists) {
      console.warn(`Patient with ID ${patientId} not found in EHR system or access denied`);
      errorReason = "Patient not found in EHR system";
      throw new Error(`Patient with ID ${patientId} not found in EHR system or access denied`);
    }
    
    // Try direct lab reports fetch first without requiring visits
    console.log(`Attempting to fetch lab reports directly for patient: ${patientId}`);
    let labReports = [];
    try {
      labReports = await fetchLabReports(patientId, ehrConfig, true);
      console.log(`Retrieved ${labReports.length} lab reports directly for patient`);
    } catch (labError) {
      console.warn("Failed to get lab reports directly, will try through visits:", labError);
    }
    
    // Try to fetch patient visits
    console.log(`Fetching visits for patient: ${patientId}`);
    const visits = await fetchVisits(patientId, ehrConfig);
    console.log(`Retrieved ${visits.length} visits for patient`);
    
    // If we got lab reports directly and no visits, we can skip the visit-based fetching
    if (labReports.length === 0 && visits.length > 0) {
      console.log("No direct lab reports found, fetching through visits");
      // For each visit, fetch lab reports in parallel
      const labReportsPromises = visits.map(visit => fetchLabReports(visit.id, ehrConfig));
      const labReportsResults = await Promise.all(labReportsPromises);
      labReports = labReportsResults.flat();
      console.log(`Retrieved ${labReports.length} lab reports through visits`);
    }
    
    // Fetch medications and appointments
    console.log("Fetching medications and appointments");
    const medicationsPromises = visits.map(visit => fetchMedications(visit.id, ehrConfig));
    const appointmentsPromise = fetchAppointments(patientId, ehrConfig);
    
    // Wait for all API calls to complete
    const [allMedications, appointments] = await Promise.all([
      Promise.all(medicationsPromises),
      appointmentsPromise
    ]);
    
    // Flatten arrays of medications
    const medications = allMedications.flat();
    
    // Convert visits to medical summaries
    const medicalSummaries = visitsToMedicalSummaries(visits);
    
    console.log(`Sync summary: ${labReports.length} lab reports, ${medications.length} medications, ${appointments.length} appointments, ${medicalSummaries.length} summaries`);
    
    return {
      labReports,
      medications,
      appointments,
      medicalSummaries,
      visits,
      _meta: {
        usingMockData: false,
        patientId: patientId
      }
    };
  } catch (error) {
    console.error('Error fetching data from EHR:', error);
    usingMockData = true;
    
    // Return mock data in case of errors
    console.log(`Using mock data as fallback due to error: ${errorReason || (error instanceof Error ? error.message : "Unknown error")}`);
    const mockData = getMockEhrData(patientId);
    mockData._meta = {
      usingMockData: true,
      error: errorReason || (error instanceof Error ? error.message : "Unknown error"),
      patientId: patientId
    };
    return mockData;
  }
}

/**
 * Get mock EHR data when the API is unavailable
 */
export function getMockEhrData(patientId?: string): EhrData {
  console.log(`Generating mock EHR data${patientId ? ` for patient ${patientId}` : ''}`);
  
  return {
    labReports: getMockLabReports(),
    medications: getMockMedications(),
    appointments: getMockAppointments(),
    medicalSummaries: getMockMedicalSummaries(),
    _meta: {
      usingMockData: true,
      patientId: patientId
    }
  };
}
