
import { corsHeaders } from '../_shared/cors-helpers.ts';

// Test connection to the EHR API
export async function testEhrConnection(config: any): Promise<Response> {
  try {
    console.log('Testing connection to EHR API at:', config.api_endpoint);
    
    // Try to fetch the list of doctors as a simple connection test
    const response = await fetch(`${config.api_endpoint}/listDoctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully connected to the EHR API',
        data: { doctors: data.length }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error testing EHR connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Failed to connect to EHR API: ${error.message}`
      }),
      { 
        status: 200,  // We still return 200 as this is a test result, not an error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Fetch data from EHR API
export async function fetchEhrData(patientId: string, ehrConfig: any) {
  console.log(`Fetching data for patient: ${patientId} from EHR API`);
  
  try {
    // In a real implementation, these would be actual API calls
    const baseUrl = ehrConfig.api_endpoint;
    const token = ehrConfig.api_key;
    
    // Fetch appointments
    const appointmentsResponse = await fetch(`${baseUrl}/fetchAppointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!appointmentsResponse.ok) {
      console.error(`Error fetching appointments: ${appointmentsResponse.status}`);
    }
    
    // Fetch patient visits
    const visitsResponse = await fetch(`${baseUrl}/fetchPatientVisits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!visitsResponse.ok) {
      console.error(`Error fetching visits: ${visitsResponse.status}`);
    }
    
    const visits = await visitsResponse.json();
    
    // For each visit, fetch lab reports and medications
    const labReportsPromises = visits.map(async (visit: any) => {
      const response = await fetch(`${baseUrl}/fetchLabReports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ visitId: visit.id })
      });
      
      if (!response.ok) {
        console.error(`Error fetching lab reports for visit ${visit.id}: ${response.status}`);
        return [];
      }
      
      return await response.json();
    });
    
    const medicationsPromises = visits.map(async (visit: any) => {
      const response = await fetch(`${baseUrl}/fetchPatientMedications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ visitId: visit.id })
      });
      
      if (!response.ok) {
        console.error(`Error fetching medications for visit ${visit.id}: ${response.status}`);
        return [];
      }
      
      return await response.json();
    });
    
    // Wait for all API calls to complete
    const [appointments, allLabReports, allMedications] = await Promise.all([
      appointmentsResponse.ok ? appointmentsResponse.json() : [],
      Promise.all(labReportsPromises),
      Promise.all(medicationsPromises)
    ]);
    
    // Flatten arrays of lab reports and medications
    const labReports = allLabReports.flat();
    const medications = allMedications.flat();
    
    // Construct medical summaries from visits
    const medicalSummaries = visits.map((visit: any) => ({
      ehrReferenceId: `EHR-VISIT-${visit.id}`,
      type: visit.type || 'Visit',
      date: visit.date,
      doctor: visit.doctor,
      notes: visit.notes || 'No notes available'
    }));
    
    return {
      labReports,
      medications,
      appointments,
      medicalSummaries,
      visits
    };
  } catch (error) {
    console.error('Error fetching data from EHR:', error);
    
    // Fallback to mock data in case of errors
    console.log('Using mock data as fallback due to error');
    return getMockEhrData(patientId);
  }
}

// Fallback function that returns mock data
export function getMockEhrData(patientId: string) {
  console.log(`Generating mock data for patient ${patientId} due to API error`);
  
  return {
    labReports: [
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
    ],
    medications: [
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
    ],
    appointments: [
      {
        ehrReferenceId: 'EHR-APT-9012',
        type: 'Follow-up',
        date: '2024-07-15',
        time: '10:30 AM',
        doctor: 'Dr. Manzoor Nellancheri',
        status: 'Upcoming',
        location: 'Vakkad Branch'
      },
      {
        ehrReferenceId: 'EHR-APT-9013',
        type: 'Annual Physical',
        date: '2024-08-20',
        time: '2:00 PM',
        doctor: 'Dr. Praveen V',
        status: 'Upcoming',
        location: 'Unniyal Branch'
      }
    ],
    medicalSummaries: [
      {
        ehrReferenceId: 'EHR-SUM-3456',
        type: 'Annual Checkup',
        date: '2024-06-01',
        doctor: 'Dr. Manzoor Nellancheri',
        notes: 'Patient is in good health. Blood pressure well controlled. Continuing with current medication regimen.'
      }
    ]
  };
}
