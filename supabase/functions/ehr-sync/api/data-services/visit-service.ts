
import { Visit, MedicalSummary, EhrApiConfig } from "../types.ts";

/**
 * Fetch visits for a patient
 */
export async function fetchVisits(patientId: string, config: EhrApiConfig): Promise<Visit[]> {
  console.log(`Fetching visits for patient: ${patientId}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/fetchPatientVisits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!response.ok) {
      console.error(`Error fetching visits for patient ${patientId}: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Exception fetching visits for patient ${patientId}:`, error);
    return [];
  }
}

/**
 * Convert visits to medical summaries
 */
export function visitsToMedicalSummaries(visits: Visit[]): MedicalSummary[] {
  return visits.map((visit: Visit) => ({
    ehrReferenceId: `EHR-VISIT-${visit.id}`,
    type: visit.type || 'Visit',
    date: visit.date,
    doctor: visit.doctor,
    notes: visit.notes || 'No notes available'
  }));
}

/**
 * Generate mock medical summaries for testing
 */
export function getMockMedicalSummaries(): MedicalSummary[] {
  return [
    {
      ehrReferenceId: 'EHR-SUM-3456',
      type: 'Annual Checkup',
      date: '2024-06-01',
      doctor: 'Dr. Manzoor Nellancheri',
      notes: 'Patient is in good health. Blood pressure well controlled. Continuing with current medication regimen.'
    }
  ];
}
