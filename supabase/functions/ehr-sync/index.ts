
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('EHR sync function called')
    
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
    const { patientId } = await req.json()
    if (!patientId) {
      return new Response(
        JSON.stringify({ error: 'Patient ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // In a real implementation, you would call your EHR API here
    // This is a placeholder for the actual EHR API call
    // Replace with actual API call to your EHR system
    
    console.log(`Syncing data for patient: ${patientId} from EHR at ${ehrConfig.api_endpoint}`)
    
    // Simulated data from EHR system
    // In a real implementation, you would fetch this data from your EHR API
    const mockEhrData = await simulateEhrApiCall(patientId, ehrConfig)
    
    // Update patient data in Supabase with data from EHR
    await syncLabReports(supabase, patientId, mockEhrData.labReports)
    await syncMedications(supabase, patientId, mockEhrData.medications)
    await syncAppointments(supabase, patientId, mockEhrData.appointments)
    await syncMedicalSummaries(supabase, patientId, mockEhrData.medicalSummaries)
    
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

// Helper functions 

// Simulate EHR API call (replace with actual API call)
async function simulateEhrApiCall(patientId: string, ehrConfig: any) {
  // In a real implementation, you would make an HTTP request to your EHR API
  // using the provided API endpoint and key from the ehrConfig
  
  console.log(`Making simulated call to EHR API at ${ehrConfig.api_endpoint} for patient ${patientId}`)
  
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data that would come from your EHR system
  return {
    labReports: [
      {
        ehrReferenceId: 'EHR-LAB-12345',
        date: '2024-06-10',
        type: 'Complete Blood Count',
        doctor: 'Dr. Manzoor Nellancheri',
        status: 'Completed',
        results: [
          { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.5-17.5' },
          { parameter: 'White Blood Cells', value: '7.5', unit: 'K/uL', normalRange: '4.5-11.0' },
          { parameter: 'Platelets', value: '250', unit: 'K/uL', normalRange: '150-450' }
        ]
      },
      {
        ehrReferenceId: 'EHR-LAB-12346',
        date: '2024-06-05',
        type: 'Lipid Panel',
        doctor: 'Dr. Shahar Banu',
        status: 'Completed',
        results: [
          { parameter: 'Total Cholesterol', value: '185', unit: 'mg/dL', normalRange: '<200' },
          { parameter: 'LDL', value: '110', unit: 'mg/dL', normalRange: '<100' },
          { parameter: 'HDL', value: '55', unit: 'mg/dL', normalRange: '>40' },
          { parameter: 'Triglycerides', value: '120', unit: 'mg/dL', normalRange: '<150' }
        ]
      }
    ],
    medications: [
      {
        ehrReferenceId: 'EHR-MED-5678',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        prescribed: '2024-05-15',
        doctor: 'Dr. Shahar Banu'
      },
      {
        ehrReferenceId: 'EHR-MED-5679',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribed: '2024-05-15',
        doctor: 'Dr. Shahar Banu'
      }
    ],
    appointments: [
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
    ],
    medicalSummaries: [
      {
        ehrReferenceId: 'EHR-SUM-3456',
        type: 'Annual Checkup',
        date: '2024-06-01',
        doctor: 'Dr. Manzoor Nellancheri',
        notes: 'Patient is in good health. Blood pressure well controlled. Continuing with current medication regimen.'
      }
    ]
  }
}

// Sync lab reports from EHR to Supabase
async function syncLabReports(supabase: any, patientId: string, labReports: any[]) {
  console.log(`Syncing ${labReports.length} lab reports for patient ${patientId}`)
  
  for (const report of labReports) {
    // Check if this report already exists
    const { data: existing } = await supabase
      .from('lab_reports')
      .select('id')
      .eq('ehr_reference_id', report.ehrReferenceId)
      .eq('patient_id', patientId)
    
    if (existing && existing.length > 0) {
      // Update existing report
      await supabase
        .from('lab_reports')
        .update({
          date: report.date,
          type: report.type,
          doctor: report.doctor,
          status: report.status,
          results: report.results
        })
        .eq('id', existing[0].id)
      
      console.log(`Updated lab report: ${existing[0].id}`)
    } else {
      // Insert new report
      const { data, error } = await supabase
        .from('lab_reports')
        .insert({
          patient_id: patientId,
          date: report.date,
          type: report.type,
          doctor: report.doctor,
          status: report.status,
          results: report.results,
          ehr_reference_id: report.ehrReferenceId
        })
      
      if (error) {
        console.error('Error inserting lab report:', error)
      } else {
        console.log('Inserted new lab report')
      }
    }
  }
}

// Sync medications from EHR to Supabase
async function syncMedications(supabase: any, patientId: string, medications: any[]) {
  console.log(`Syncing ${medications.length} medications for patient ${patientId}`)
  
  for (const medication of medications) {
    // Check if this medication already exists
    const { data: existing } = await supabase
      .from('medications')
      .select('id')
      .eq('ehr_reference_id', medication.ehrReferenceId)
      .eq('patient_id', patientId)
    
    if (existing && existing.length > 0) {
      // Update existing medication
      await supabase
        .from('medications')
        .update({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          prescribed: medication.prescribed,
          doctor: medication.doctor
        })
        .eq('id', existing[0].id)
      
      console.log(`Updated medication: ${existing[0].id}`)
    } else {
      // Insert new medication
      const { data, error } = await supabase
        .from('medications')
        .insert({
          patient_id: patientId,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          prescribed: medication.prescribed,
          doctor: medication.doctor,
          ehr_reference_id: medication.ehrReferenceId
        })
      
      if (error) {
        console.error('Error inserting medication:', error)
      } else {
        console.log('Inserted new medication')
      }
    }
  }
}

// Sync appointments from EHR to Supabase
async function syncAppointments(supabase: any, patientId: string, appointments: any[]) {
  console.log(`Syncing ${appointments.length} appointments for patient ${patientId}`)
  
  for (const appointment of appointments) {
    // Check if this appointment already exists
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('ehr_reference_id', appointment.ehrReferenceId)
      .eq('patient_id', patientId)
    
    if (existing && existing.length > 0) {
      // Update existing appointment
      await supabase
        .from('appointments')
        .update({
          type: appointment.type,
          date: appointment.date,
          time: appointment.time,
          doctor: appointment.doctor,
          status: appointment.status,
          location: appointment.location
        })
        .eq('id', existing[0].id)
      
      console.log(`Updated appointment: ${existing[0].id}`)
    } else {
      // Insert new appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          type: appointment.type,
          date: appointment.date,
          time: appointment.time,
          doctor: appointment.doctor,
          status: appointment.status,
          location: appointment.location,
          ehr_reference_id: appointment.ehrReferenceId
        })
      
      if (error) {
        console.error('Error inserting appointment:', error)
      } else {
        console.log('Inserted new appointment')
      }
    }
  }
}

// Sync medical summaries from EHR to Supabase
async function syncMedicalSummaries(supabase: any, patientId: string, summaries: any[]) {
  console.log(`Syncing ${summaries.length} medical summaries for patient ${patientId}`)
  
  for (const summary of summaries) {
    // Check if this summary already exists
    const { data: existing } = await supabase
      .from('medical_summaries')
      .select('id')
      .eq('ehr_reference_id', summary.ehrReferenceId)
      .eq('patient_id', patientId)
    
    if (existing && existing.length > 0) {
      // Update existing summary
      await supabase
        .from('medical_summaries')
        .update({
          type: summary.type,
          date: summary.date,
          doctor: summary.doctor,
          notes: summary.notes
        })
        .eq('id', existing[0].id)
      
      console.log(`Updated medical summary: ${existing[0].id}`)
    } else {
      // Insert new summary
      const { data, error } = await supabase
        .from('medical_summaries')
        .insert({
          patient_id: patientId,
          type: summary.type,
          date: summary.date,
          doctor: summary.doctor,
          notes: summary.notes,
          ehr_reference_id: summary.ehrReferenceId
        })
      
      if (error) {
        console.error('Error inserting medical summary:', error)
      } else {
        console.log('Inserted new medical summary')
      }
    }
  }
}
