
import { EhrApiConfig } from "../types.ts";

/**
 * List all doctors, optionally filtered by specialty or location
 */
export async function listDoctors(config: EhrApiConfig, speciality?: string, location?: string): Promise<any> {
  console.log(`Fetching doctors${speciality ? ` with speciality: ${speciality}` : ''}${location ? ` at location: ${location}` : ''}`);
  
  try {
    // Build the URL with query parameters for filtering
    let url = `${config.api_endpoint}/listDoctors`;
    const queryParams = [];
    
    if (speciality) {
      queryParams.push(`speciality=${encodeURIComponent(speciality)}`);
    }
    
    if (location) {
      queryParams.push(`location=${encodeURIComponent(location)}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching doctors: ${response.status}`);
      return { success: false, doctors: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Exception fetching doctors:', error);
    return { success: false, doctors: [] };
  }
}

/**
 * Get available appointment slots for a doctor on a specific date
 */
export async function getDoctorSlots(doctorId: string, date: string, config: EhrApiConfig): Promise<any> {
  console.log(`Fetching slots for doctor ${doctorId} on date ${date}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/getDoctorSlots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ doctorId, date })
    });
    
    if (!response.ok) {
      console.error(`Error fetching slots for doctor ${doctorId}: ${response.status}`);
      return { success: false, slots: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Exception fetching slots for doctor ${doctorId}:`, error);
    return { success: false, slots: [] };
  }
}

/**
 * Generate mock doctor list
 */
export function getMockDoctors(speciality?: string, location?: string): any {
  const allDoctors = [
    { id: "DOC123", name: "Dr. Jane Smith", speciality: "Cardiology", location: "Main Branch" },
    { id: "DOC124", name: "Dr. John Davis", speciality: "Neurology", location: "Main Branch" },
    { id: "DOC125", name: "Dr. Shahar Banu", speciality: "Internal Medicine", location: "Vakkad Branch" },
    { id: "DOC126", name: "Dr. Manzoor Nellancheri", speciality: "ENT", location: "Unniyal Branch" },
    { id: "DOC127", name: "Dr. Praveen V", speciality: "Orthopedics", location: "Unniyal Branch" }
  ];
  
  let doctors = [...allDoctors];
  
  // Apply filters if provided
  if (speciality) {
    doctors = doctors.filter(doc => doc.speciality.toLowerCase() === speciality.toLowerCase());
  }
  
  if (location) {
    doctors = doctors.filter(doc => doc.location.toLowerCase() === location.toLowerCase());
  }
  
  return { success: true, doctors };
}

/**
 * Generate mock doctor slots
 */
export function getMockDoctorSlots(date: string): any {
  // Generate some time slots based on the date
  // For simplicity, we'll generate the same slots regardless of the date
  const slots = ["09:00", "09:30", "10:00", "11:30", "14:00", "14:30", "15:00", "16:30"];
  
  // If the date is a weekend, reduce available slots
  const d = new Date(date);
  const day = d.getDay();
  
  if (day === 0) { // Sunday
    return { success: true, slots: [] }; // No slots on Sunday
  } else if (day === 6) { // Saturday
    return { success: true, slots: slots.slice(0, 4) }; // Fewer slots on Saturday
  }
  
  return { success: true, slots };
}
