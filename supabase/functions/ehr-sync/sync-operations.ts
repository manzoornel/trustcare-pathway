import { corsHeaders } from '../_shared/cors-helpers.ts';

// Sync lab reports from EHR to Supabase
export async function syncLabReports(supabase: any, patientId: string, labReports: any[]) {
  console.log(`Syncing ${labReports.length} lab reports for patient ${patientId}`);
  
  // Track IDs of reports that were updated/inserted
  const syncedReportIds = [];
  
  for (const report of labReports) {
    // Make sure we have a valid report with at least some essential fields
    if (!report || !report.type || !report.date) {
      console.warn('Skipping invalid lab report:', report);
      continue;
    }
    
    // Ensure the report has an ID - use ehrReferenceId or generate one if missing
    const reportRefId = report.ehrReferenceId || report.id || `gen-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    try {
      // Check if this report already exists
      const { data: existing } = await supabase
        .from('lab_reports')
        .select('id')
        .eq('ehr_reference_id', reportRefId)
        .eq('patient_id', patientId);
      
      if (existing && existing.length > 0) {
        // Update existing report
        const { error: updateError } = await supabase
          .from('lab_reports')
          .update({
            date: report.date,
            type: report.type,
            doctor: report.doctor,
            status: report.status,
            results: report.results || []
          })
          .eq('id', existing[0].id);
        
        if (updateError) {
          console.error('Error updating lab report:', updateError);
        } else {
          console.log(`Updated lab report: ${existing[0].id}`);
          syncedReportIds.push(existing[0].id);
        }
      } else {
        // Insert new report
        const { data, error } = await supabase
          .from('lab_reports')
          .insert({
            patient_id: patientId,
            date: report.date,
            type: report.type,
            doctor: report.doctor || "Unknown",
            status: report.status || "Completed",
            results: report.results || [],
            ehr_reference_id: reportRefId
          })
          .select('id');
        
        if (error) {
          console.error('Error inserting lab report:', error);
        } else if (data && data.length > 0) {
          console.log(`Inserted new lab report: ${data[0].id}`);
          syncedReportIds.push(data[0].id);
        } else {
          console.log('Inserted new lab report but could not retrieve ID');
        }
      }
    } catch (error) {
      console.error(`Error processing lab report with reference ${reportRefId}:`, error);
    }
  }
  
  console.log(`Successfully synced ${syncedReportIds.length} out of ${labReports.length} lab reports`);
  return syncedReportIds;
}

export async function syncMedications(supabase: any, patientId: string, medications: any[]) {
  console.log(`Syncing ${medications.length} medications for patient ${patientId}`);
  
  for (const medication of medications) {
    // Check if this medication already exists
    const { data: existing } = await supabase
      .from('medications')
      .select('id')
      .eq('ehr_reference_id', medication.ehrReferenceId)
      .eq('patient_id', patientId);
    
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
        .eq('id', existing[0].id);
      
      console.log(`Updated medication: ${existing[0].id}`);
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
        });
      
      if (error) {
        console.error('Error inserting medication:', error);
      } else {
        console.log('Inserted new medication');
      }
    }
  }
}

export async function syncAppointments(supabase: any, patientId: string, appointments: any[]) {
  console.log(`Syncing ${appointments.length} appointments for patient ${patientId}`);
  
  for (const appointment of appointments) {
    // Check if this appointment already exists
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('ehr_reference_id', appointment.ehrReferenceId)
      .eq('patient_id', patientId);
    
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
        .eq('id', existing[0].id);
      
      console.log(`Updated appointment: ${existing[0].id}`);
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
        });
      
      if (error) {
        console.error('Error inserting appointment:', error);
      } else {
        console.log('Inserted new appointment');
      }
    }
  }
}

export async function syncMedicalSummaries(supabase: any, patientId: string, summaries: any[]) {
  console.log(`Syncing ${summaries.length} medical summaries for patient ${patientId}`);
  
  for (const summary of summaries) {
    // Check if this summary already exists
    const { data: existing } = await supabase
      .from('medical_summaries')
      .select('id')
      .eq('ehr_reference_id', summary.ehrReferenceId)
      .eq('patient_id', patientId);
    
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
        .eq('id', existing[0].id);
      
      console.log(`Updated medical summary: ${existing[0].id}`);
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
        });
      
      if (error) {
        console.error('Error inserting medical summary:', error);
      } else {
        console.log('Inserted new medical summary');
      }
    }
  }
}
