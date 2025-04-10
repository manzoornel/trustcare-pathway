
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { fetchEhrData } from './ehr-api.ts'
import { 
  syncLabReports, 
  syncMedications, 
  syncAppointments, 
  syncMedicalSummaries 
} from './sync-operations.ts'
import { createSyncRecord } from './sync-history.ts'

/**
 * Perform the patient data synchronization with the EHR system
 */
export async function syncPatientData(
  supabase: ReturnType<typeof createClient>,
  patientId: string,
  patientEhrId: string | undefined,
  ehrConfig: any
) {
  // Create initial sync record
  const syncMessage = patientEhrId 
    ? `Starting sync for patient: ${patientId} with EHR ID: ${patientEhrId}`
    : `Starting sync for patient: ${patientId}`;
  
  await createSyncRecord(supabase, patientId, 'in_progress', syncMessage)
  
  // Log the attempt
  console.log(`Syncing data for patient: ${patientId}${patientEhrId ? ` with EHR ID: ${patientEhrId}` : ''} from EHR at ${ehrConfig.api_endpoint}`)
  
  try {
    // Get data from the EHR system API with the EHR patient ID if available
    const ehrData = await fetchEhrData(patientEhrId || patientId, ehrConfig)
    
    // Update patient data in Supabase with data from EHR
    await syncLabReports(supabase, patientId, ehrData.labReports)
    await syncMedications(supabase, patientId, ehrData.medications)
    await syncAppointments(supabase, patientId, ehrData.appointments)
    await syncMedicalSummaries(supabase, patientId, ehrData.medicalSummaries)
    
    // If we received an EHR ID and it's not already set for this patient, update it
    if (patientEhrId && patientId) {
      await updatePatientHospitalId(supabase, patientId, patientEhrId)
    }
    
    // Update last sync time
    await supabase
      .from('ehr_integration')
      .update({ last_sync_time: new Date().toISOString() })
      .eq('id', ehrConfig.id)
    
    // Log successful sync
    const syncDetails = {
      labReports: ehrData.labReports.length,
      medications: ehrData.medications.length,
      appointments: ehrData.appointments.length,
      medicalSummaries: ehrData.medicalSummaries.length
    };

    const successMsg = patientEhrId 
      ? `Successfully synchronized data for patient: ${patientId} with EHR ID: ${patientEhrId}`
      : `Successfully synchronized data for patient: ${patientId}`;
      
    await createSyncRecord(
      supabase, 
      patientId, 
      'success', 
      successMsg,
      JSON.stringify(syncDetails)
    )
    
    return {
      success: true, 
      message: 'Patient data synchronized successfully',
      syncTime: new Date().toISOString(),
      data: syncDetails
    }
  } catch (syncError: any) {
    // Log sync failure
    console.error('Error during sync operation:', syncError)
    await createSyncRecord(
      supabase, 
      patientId, 
      'failed', 
      `Sync failed for patient: ${patientId}`, 
      syncError.message || JSON.stringify(syncError)
    )
    
    throw new Error(syncError.message || 'Unknown error during synchronization')
  }
}

/**
 * Update the hospital_id in the patient profile if needed
 */
async function updatePatientHospitalId(
  supabase: ReturnType<typeof createClient>,
  patientId: string, 
  hospitalId: string
) {
  // Check if the patient profile exists and needs the hospital_id updated
  const { data: profile } = await supabase
    .from('patient_profiles')
    .select('hospital_id')
    .eq('id', patientId)
    .single();
    
  if (profile && (!profile.hospital_id || profile.hospital_id !== hospitalId)) {
    // Update the hospital_id in the patient profile
    await supabase
      .from('patient_profiles')
      .update({ hospital_id: hospitalId })
      .eq('id', patientId);
      
    console.log(`Updated patient ${patientId} with hospital_id: ${hospitalId}`);
  }
}
