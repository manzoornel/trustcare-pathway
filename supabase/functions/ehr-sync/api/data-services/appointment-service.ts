
import { Appointment, EhrApiConfig } from "../types.ts";

/**
 * Fetch appointments for a patient
 */
export async function fetchAppointments(patientId: string, config: EhrApiConfig): Promise<Appointment[]> {
  console.log(`Fetching appointments for patient: ${patientId}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/fetchAppointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ patientId })
    });
    
    if (!response.ok) {
      console.error(`Error fetching appointments for patient ${patientId}: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Exception fetching appointments for patient ${patientId}:`, error);
    return [];
  }
}

/**
 * Generate mock appointments for testing
 */
export function getMockAppointments(): Appointment[] {
  return [
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
  ];
}
