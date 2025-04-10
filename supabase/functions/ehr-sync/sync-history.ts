
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

/**
 * Create a sync history record in the database
 */
export async function createSyncRecord(
  supabase: ReturnType<typeof createClient>,
  patientId: string | null, 
  status: 'success' | 'failed' | 'in_progress', 
  message: string, 
  details?: string
) {
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
  
  return { data, error }
}
