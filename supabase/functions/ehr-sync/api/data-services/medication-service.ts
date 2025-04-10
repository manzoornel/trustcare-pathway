
import { Medication, EhrApiConfig } from "../types.ts";

/**
 * Fetch medications for a specific patient visit
 */
export async function fetchMedications(visitId: string, config: EhrApiConfig): Promise<Medication[]> {
  console.log(`Fetching medications for visit: ${visitId}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/fetchPatientMedications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ visitId })
    });
    
    if (!response.ok) {
      console.error(`Error fetching medications for visit ${visitId}: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Exception fetching medications for visit ${visitId}:`, error);
    return [];
  }
}

/**
 * Generate mock medications for testing
 */
export function getMockMedications(): Medication[] {
  return [
    {
      ehrReferenceId: 'EHR-MED-5678',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily at bedtime',
      prescribed: '2024-05-15',
      doctor: 'Dr. Shahar Banu'
    },
    {
      ehrReferenceId: 'EHR-MED-5679',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribed: '2024-05-15',
      doctor: 'Dr. Shahar Banu'
    }
  ];
}
