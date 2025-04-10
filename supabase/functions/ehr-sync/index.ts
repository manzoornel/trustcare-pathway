
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
    const { patientId } = requestData
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
    
    // Log the sync start
    await createSyncRecord(patientId, 'in_progress', `Starting sync for patient: ${patientId}`)
    
    // Log the attempt
    console.log(`Syncing data for patient: ${patientId} from EHR at ${ehrConfig.api_endpoint}`)
    
    try {
      // Get data from the EHR system API
      const ehrData = await fetchEhrData(patientId, ehrConfig)
      
      // Update patient data in Supabase with data from EHR
      await syncLabReports(supabase, patientId, ehrData.labReports)
      await syncMedications(supabase, patientId, ehrData.medications)
      await syncAppointments(supabase, patientId, ehrData.appointments)
      await syncMedicalSummaries(supabase, patientId, ehrData.medicalSummaries)
      
      // Update last sync time
      await supabase
        .from('ehr_integration')
        .update({ last_sync_time: new Date().toISOString() })
        .eq('id', ehrConfig.id)
      
      // Log successful sync
      await createSyncRecord(
        patientId, 
        'success', 
        `Successfully synchronized data for patient: ${patientId}`,
        JSON.stringify({
          labReports: ehrData.labReports.length,
          medications: ehrData.medications.length,
          appointments: ehrData.appointments.length,
          medicalSummaries: ehrData.medicalSummaries.length
        })
      )
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Patient data synchronized successfully',
          syncTime: new Date().toISOString()
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
