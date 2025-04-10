
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders, handleCORS } from '../_shared/cors-helpers.ts'
import { testEhrConnection, fetchEhrData } from './ehr-api.ts'
import { 
  syncLabReports, 
  syncMedications, 
  syncAppointments, 
  syncMedicalSummaries 
} from './sync-operations.ts'
import { EHRSyncHistory } from './types.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    console.log('EHR sync function called')
    
    // Get request body
    const requestData = await req.json()
    const action = requestData.action || 'sync'
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create sync history record
    const createSyncRecord = async (patientId: string | null, status: 'success' | 'failed' | 'in_progress', message: string, details?: string) => {
      const record = {
        status,
        message,
        patient_id: patientId || null,
        details,
        timestamp: new Date().toISOString()
      }
      
      // Log the record to assist with debugging
      console.log('Creating sync record:', JSON.stringify(record))
      
      const { data, error } = await supabase.from('ehr_sync_history').insert(record)
      if (error) {
        console.error('Error creating sync record:', error)
      }
    }
    
    // Handle test connection action
    if (action === 'test') {
      const config = requestData.config
      console.log('Testing EHR connection with config:', config)
      
      // Test connection to the EHR API
      return await testEhrConnection(config)
    }
    
    // Get EHR configuration
    const { data: ehrConfig, error: configError } = await supabase
      .from('ehr_integration')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    
    if (configError) {
      console.error('Error fetching EHR configuration:', configError)
      await createSyncRecord(null, 'failed', 'No active EHR integration configuration found', JSON.stringify(configError))
      
      return new Response(
        JSON.stringify({ 
          error: 'No active EHR integration configuration found', 
          details: configError 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Get patient ID from request
    const { patientId, patientEhrId } = requestData
    
    if (!patientId) {
      await createSyncRecord(null, 'failed', 'Patient ID is required')
      
      return new Response(
        JSON.stringify({ error: 'Patient ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Log the sync start with both IDs if available
    const syncMessage = patientEhrId 
      ? `Starting sync for patient: ${patientId} with EHR ID: ${patientEhrId}`
      : `Starting sync for patient: ${patientId}`;
    
    await createSyncRecord(patientId, 'in_progress', syncMessage)
    
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
        // Check if the patient profile exists and needs the hospital_id updated
        const { data: profile } = await supabase
          .from('patient_profiles')
          .select('hospital_id')
          .eq('id', patientId)
          .single();
          
        if (profile && (!profile.hospital_id || profile.hospital_id !== patientEhrId)) {
          // Update the hospital_id in the patient profile
          await supabase
            .from('patient_profiles')
            .update({ hospital_id: patientEhrId })
            .eq('id', patientId);
            
          console.log(`Updated patient ${patientId} with hospital_id: ${patientEhrId}`);
        }
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
        patientId, 
        'success', 
        successMsg,
        JSON.stringify(syncDetails)
      )
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Patient data synchronized successfully',
          syncTime: new Date().toISOString(),
          data: syncDetails
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } catch (syncError: any) {
      // Log sync failure
      console.error('Error during sync operation:', syncError)
      await createSyncRecord(
        patientId, 
        'failed', 
        `Sync failed for patient: ${patientId}`, 
        syncError.message || JSON.stringify(syncError)
      )
      
      return new Response(
        JSON.stringify({ 
          error: 'Sync failed', 
          details: syncError.message || 'Unknown error during synchronization' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
  } catch (error: any) {
    console.error('Error in EHR sync function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
