
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
      return new Response(
        JSON.stringify({ error: 'Patient ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Log the attempt
    console.log(`Syncing data for patient: ${patientId} from EHR at ${ehrConfig.api_endpoint}`)
    
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
    
  } catch (error) {
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
