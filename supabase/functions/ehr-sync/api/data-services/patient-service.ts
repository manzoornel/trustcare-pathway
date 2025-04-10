
import { EhrApiConfig } from "../types.ts";

/**
 * Fetch patient demographics to verify the patient exists
 */
export async function fetchPatientDemographics(patientId: string, config: EhrApiConfig): Promise<boolean> {
  console.log(`Fetching demographics for patient: ${patientId}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/fetchPatientDemographics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!response.ok) {
      console.error(`Error fetching patient demographics: ${response.status}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    return false;
  }
}
