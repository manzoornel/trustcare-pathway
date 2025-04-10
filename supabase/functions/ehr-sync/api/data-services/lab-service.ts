
import { LabReport, EhrApiConfig } from "../types.ts";

/**
 * Fetch lab reports for a specific patient visit or directly for a patient
 * @param id The visit ID or patient ID
 * @param config The EHR API configuration
 * @param isPatientId Whether the ID is a patient ID (true) or visit ID (false)
 */
export async function fetchLabReports(id: string, config: EhrApiConfig, isPatientId: boolean = false): Promise<LabReport[]> {
  console.log(`Fetching lab reports for ${isPatientId ? 'patient' : 'visit'}: ${id}`);
  
  try {
    const endpointUrl = `${config.api_endpoint}/${isPatientId ? 'fetchPatientLabReports' : 'fetchLabReports'}`;
    const payload = isPatientId ? { patientId: id } : { visitId: id };
    
    console.log(`Calling EHR API at ${endpointUrl} with payload:`, JSON.stringify(payload));
    
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching lab reports for ${isPatientId ? 'patient' : 'visit'} ${id}: ${response.status}, ${errorText}`);
      return [];
    }
    
    const responseData = await response.json();
    console.log(`Successfully retrieved ${responseData.length || 0} lab reports`);
    
    // If the response is not an array, check if it has a data property that might contain the array
    if (responseData && !Array.isArray(responseData) && responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    
    return Array.isArray(responseData) ? responseData : [];
  } catch (error) {
    console.error(`Exception fetching lab reports for ${isPatientId ? 'patient' : 'visit'} ${id}:`, error);
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
      id: 'EHR-LAB-12345',
      date: '2023-11-15',
      type: 'Blood Test',
      doctor: 'Dr. Sharma',
      status: 'Completed',
      results: [
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.5-17.5' },
        { parameter: 'White Blood Cells', value: '7.5', unit: 'K/uL', normalRange: '4.5-11.0' },
        { parameter: 'Platelets', value: '250', unit: 'K/uL', normalRange: '150-450' }
      ]
    },
    {
      ehrReferenceId: 'EHR-LAB-12346',
      id: 'EHR-LAB-12346',
      date: '2023-09-03',
      type: 'Blood Test',
      doctor: 'Dr. Patel',
      status: 'Completed',
      results: [
        { parameter: 'Total Cholesterol', value: '185', unit: 'mg/dL', normalRange: '<200' },
        { parameter: 'LDL', value: '110', unit: 'mg/dL', normalRange: '<100' },
        { parameter: 'HDL', value: '55', unit: 'mg/dL', normalRange: '>40' },
        { parameter: 'Triglycerides', value: '120', unit: 'mg/dL', normalRange: '<150' }
      ]
    },
    {
      ehrReferenceId: 'EHR-LAB-12347',
      id: 'EHR-LAB-12347',
      date: '2023-06-22',
      type: 'Lipid Panel',
      doctor: 'Dr. Sharma',
      status: 'Completed',
      results: [
        { parameter: 'Total Cholesterol', value: '190', unit: 'mg/dL', normalRange: '<200' },
        { parameter: 'LDL', value: '115', unit: 'mg/dL', normalRange: '<100' },
        { parameter: 'HDL', value: '50', unit: 'mg/dL', normalRange: '>40' },
        { parameter: 'Triglycerides', value: '125', unit: 'mg/dL', normalRange: '<150' }
      ]
    },
    {
      ehrReferenceId: 'EHR-LAB-12348',
      id: 'EHR-LAB-12348',
      date: '2023-02-10',
      type: 'Blood Test',
      doctor: 'Dr. Kumar',
      status: 'Completed',
      results: [
        { parameter: 'Hemoglobin', value: '13.8', unit: 'g/dL', normalRange: '13.5-17.5' },
        { parameter: 'White Blood Cells', value: '6.9', unit: 'K/uL', normalRange: '4.5-11.0' },
        { parameter: 'Platelets', value: '230', unit: 'K/uL', normalRange: '150-450' }
      ]
    }
  ];
}
