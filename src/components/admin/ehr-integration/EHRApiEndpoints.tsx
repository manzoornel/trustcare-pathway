
import React from 'react';
import { HelpCircle } from "lucide-react";

const apiEndpoints = [
  { name: 'getLoginOTP', description: 'Generate OTP for login' },
  { name: 'patientLogin', description: 'Login API' },
  { name: 'fetchAppointments', description: 'Fetch all appointments of the patient' },
  { name: 'listDoctors', description: 'Show all doctors' },
  { name: 'getDoctorSlots', description: 'Fetch all available slots of the doctor' },
  { name: 'createAppointment', description: 'Booking API' },
  { name: 'fetchPatientVisits', description: 'Fetch the visits against patient' },
  { name: 'fetchVisits', description: 'Fetch all visits of the patient' },
  { name: 'fetchLabReports', description: 'Lab report against the visit' },
  { name: 'fetchPatientMedications', description: 'Patient Medications against the visit' }
];

const EHRApiEndpoints = () => {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        The following API endpoints are available for integration with your EHR system:
      </p>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                API Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {apiEndpoints.map((endpoint, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {endpoint.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {endpoint.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium text-blue-700">
              How to use these endpoints
            </p>
            <p className="text-sm mt-1">
              These endpoints are automatically called by our system when patients use the patient portal. 
              No additional setup is required beyond configuring the API key and endpoint URL in the General Settings tab.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EHRApiEndpoints;
