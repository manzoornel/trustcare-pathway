
import { LabReport, EhrApiConfig } from "../types.ts";

/**
 * Fetch lab reports for a specific patient visit
 */
export async function fetchLabReports(visitId: string, config: EhrApiConfig): Promise<LabReport[]> {
  console.log(`Fetching lab reports for visit: ${visitId}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/fetchLabReports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ visitId })
    });
    
    if (!response.ok) {
      console.error(`Error fetching lab reports for visit ${visitId}: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Exception fetching lab reports for visit ${visitId}:`, error);
    return [];
  }
}

/**
 * Generate mock lab reports for testing
 */
export function getMockLabReports(): LabReport[] {
  return [
    {
      ehrReferenceId: 'EHR-LAB-12345',
      date: '2024-06-10',
      type: 'Complete Blood Count',
      doctor: 'Dr. Manzoor Nellancheri',
      status: 'Completed',
      results: [
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.5-17.5' },
        { parameter: 'White Blood Cells', value: '7.5', unit: 'K/uL', normalRange: '4.5-11.0' },
        { parameter: 'Platelets', value: '250', unit: 'K/uL', normalRange: '150-450' }
      ]
    },
    {
      ehrReferenceId: 'EHR-LAB-12346',
      date: '2024-06-05',
      type: 'Lipid Panel',
      doctor: 'Dr. Shahar Banu',
      status: 'Completed',
      results: [
        { parameter: 'Total Cholesterol', value: '185', unit: 'mg/dL', normalRange: '<200' },
        { parameter: 'LDL', value: '110', unit: 'mg/dL', normalRange: '<100' },
        { parameter: 'HDL', value: '55', unit: 'mg/dL', normalRange: '>40' },
        { parameter: 'Triglycerides', value: '120', unit: 'mg/dL', normalRange: '<150' }
      ]
    }
  ];
}
