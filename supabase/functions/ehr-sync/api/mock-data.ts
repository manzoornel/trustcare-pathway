
/**
 * Fallback function that returns mock data
 * @param patientId The patient ID to generate mock data for
 */
export function getMockEhrData(patientId: string) {
  console.log(`Generating mock data for patient ${patientId} due to API error`);
  
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
  };
}
