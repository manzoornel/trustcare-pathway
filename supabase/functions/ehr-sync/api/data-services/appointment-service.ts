
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
 * Create a new appointment
 */
export async function createAppointment(patientId: string, doctorId: string, date: string, time: string, reason: string | null, config: EhrApiConfig): Promise<any> {
  console.log(`Creating appointment for patient ${patientId} with doctor ${doctorId} on ${date} at ${time}`);
  
  try {
    const appointmentData = {
      patientId,
      doctorId,
      date,
      time,
      reason: reason || undefined
    };
    
    const response = await fetch(`${config.api_endpoint}/createAppointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      console.error(`Error creating appointment: ${response.status}`);
      return { success: false, error: `API responded with status ${response.status}` };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Exception creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
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

/**
 * Generate mock appointment creation response
 */
export function getMockAppointmentCreation(): any {
  return { 
    success: true, 
    appointmentId: "APT" + Math.floor(100 + Math.random() * 900), 
    message: "Appointment booked successfully" 
  };
}
