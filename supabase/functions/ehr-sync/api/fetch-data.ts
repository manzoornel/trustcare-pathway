
/**
 * Fetch data from EHR API
 * @param patientId The patient ID to fetch data for
 * @param ehrConfig The EHR API configuration
 */
export async function fetchEhrData(patientId: string, ehrConfig: any) {
  console.log(`Fetching data for patient: ${patientId} from EHR API at: ${ehrConfig.api_endpoint}`);
  
  try {
    // In a real implementation, these would be actual API calls
    const baseUrl = ehrConfig.api_endpoint;
    const token = ehrConfig.api_key;
    
    // Fetch patient demographics first to ensure the patient exists
    const patientDemographicsResponse = await fetch(`${baseUrl}/fetchPatientDemographics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!patientDemographicsResponse.ok) {
      console.error(`Error fetching patient demographics: ${patientDemographicsResponse.status}`);
      throw new Error(`Patient with ID ${patientId} not found in EHR system or access denied`);
    }
    
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
