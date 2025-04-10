
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders, handleCORS } from '../_shared/cors-helpers.ts'
import { testEhrConnection } from './ehr-api.ts'
import { createSyncRecord } from './sync-history.ts'
import { syncPatientData } from './sync-patient.ts'
import { createSuccessResponse, createErrorResponse } from './response-handlers.ts'

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
    
    // Handle test connection action
    if (action === 'test') {
      const config = requestData.config
      console.log('Testing EHR connection with config:', {
        api_endpoint: config.api_endpoint,
        api_key: config.api_key ? '**hidden**' : 'not provided'
      })
      
      // Test connection to the EHR API
      return await testEhrConnection(config)
    }
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get EHR configuration
    const { data: ehrConfig, error: configError } = await supabase
      .from('ehr_integration')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    
    if (configError) {
      console.error('Error fetching EHR configuration:', configError)
      await createSyncRecord(
        supabase,
        null, 
        'failed', 
        'No active EHR integration configuration found', 
        JSON.stringify(configError)
      )
      
      return createErrorResponse(
        'No active EHR integration configuration found', 
        configError
      )
    }
    
    // Get patient ID from request
    const { patientId, patientEhrId } = requestData
    
    if (!patientId) {
      await createSyncRecord(supabase, null, 'failed', 'Patient ID is required')
      return createErrorResponse('Patient ID is required')
    }
    
    try {
      // Perform the sync operation
      const result = await syncPatientData(supabase, patientId, patientEhrId, ehrConfig)
      return createSuccessResponse(result)
    } catch (syncError: any) {
      return createErrorResponse(
        'Sync failed', 
        syncError.message || 'Unknown error during synchronization',
        500
      )
    }
    
  } catch (error: any) {
    console.error('Error in EHR sync function:', error)
    return createErrorResponse(
      'Internal Server Error', 
      error.message,
      500
    )
  }
})
