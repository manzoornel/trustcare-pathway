
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ApiEndpoint {
  name: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responseExample: string;
  docLink: string;
}

const apiEndpoints: ApiEndpoint[] = [
  { 
    name: 'getLoginOTP', 
    description: 'Generate OTP for patient login',
    method: "POST",
    parameters: [
      { name: 'phone', type: 'string', required: true, description: 'Patient\'s registered phone number' },
      { name: 'countryCode', type: 'string', required: false, description: 'Phone country code (default: +91)' }
    ],
    responseExample: '{ "success": true, "message": "OTP sent successfully", "otpReference": "REF123456" }',
    docLink: 'https://docs.emr-provider.com/api/getLoginOTP'
  },
  {
    name: 'patientLogin', 
    description: 'Authenticate patient using OTP',
    method: "POST",
    parameters: [
      { name: 'phone', type: 'string', required: true, description: 'Patient\'s registered phone number' },
      { name: 'otp', type: 'string', required: true, description: 'OTP received by patient' },
      { name: 'otpReference', type: 'string', required: true, description: 'Reference ID received from getLoginOTP' }
    ],
    responseExample: '{ "success": true, "patientId": "PT12345", "token": "jwt-token-value" }',
    docLink: 'https://docs.emr-provider.com/api/patientLogin'
  },
  {
    name: 'fetchAppointments', 
    description: 'Fetch all appointments of the patient',
    method: "POST",
    parameters: [
      { name: 'patientId', type: 'string', required: true, description: 'Patient ID' },
      { name: 'startDate', type: 'string (YYYY-MM-DD)', required: false, description: 'Filter by start date' },
      { name: 'endDate', type: 'string (YYYY-MM-DD)', required: false, description: 'Filter by end date' },
      { name: 'status', type: 'string', required: false, description: 'Appointment status (upcoming, completed, cancelled)' }
    ],
    responseExample: '{ "success": true, "appointments": [{ "id": "APT123", "date": "2023-06-15", "time": "10:30 AM", "doctor": "Dr. John", "status": "upcoming" }] }',
    docLink: 'https://docs.emr-provider.com/api/fetchAppointments'
  },
  {
    name: 'listDoctors', 
    description: 'Get list of all doctors',
    method: "GET",
    parameters: [
      { name: 'speciality', type: 'string', required: false, description: 'Filter by doctor speciality' },
      { name: 'location', type: 'string', required: false, description: 'Filter by clinic location' }
    ],
    responseExample: '{ "success": true, "doctors": [{ "id": "DOC123", "name": "Dr. Jane Smith", "speciality": "Cardiology", "location": "Main Branch" }] }',
    docLink: 'https://docs.emr-provider.com/api/listDoctors'
  },
  {
    name: 'getDoctorSlots', 
    description: 'Fetch available appointment slots of a doctor',
    method: "POST",
    parameters: [
      { name: 'doctorId', type: 'string', required: true, description: 'Doctor ID' },
      { name: 'date', type: 'string (YYYY-MM-DD)', required: true, description: 'Date to check availability' }
    ],
    responseExample: '{ "success": true, "slots": ["09:00", "09:30", "10:00", "11:30"] }',
    docLink: 'https://docs.emr-provider.com/api/getDoctorSlots'
  },
  {
    name: 'createAppointment', 
    description: 'Book a new appointment',
    method: "POST",
    parameters: [
      { name: 'patientId', type: 'string', required: true, description: 'Patient ID' },
      { name: 'doctorId', type: 'string', required: true, description: 'Doctor ID' },
      { name: 'date', type: 'string (YYYY-MM-DD)', required: true, description: 'Appointment date' },
      { name: 'time', type: 'string (HH:MM)', required: true, description: 'Appointment time' },
      { name: 'reason', type: 'string', required: false, description: 'Reason for visit' }
    ],
    responseExample: '{ "success": true, "appointmentId": "APT456", "message": "Appointment booked successfully" }',
    docLink: 'https://docs.emr-provider.com/api/createAppointment'
  },
  {
    name: 'fetchPatientVisits', 
    description: 'Fetch past visits of a patient',
    method: "POST",
    parameters: [
      { name: 'patientId', type: 'string', required: true, description: 'Patient ID' },
      { name: 'limit', type: 'number', required: false, description: 'Number of records to return (default: 10)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset (default: 0)' }
    ],
    responseExample: '{ "success": true, "visits": [{ "id": "VST123", "date": "2023-05-10", "doctor": "Dr. John", "diagnosis": "Common cold", "notes": "Prescribed antibiotics" }] }',
    docLink: 'https://docs.emr-provider.com/api/fetchPatientVisits'
  },
  {
    name: 'fetchVisits', 
    description: 'Fetch all visits of the patient',
    method: "POST",
    parameters: [
      { name: 'patientId', type: 'string', required: true, description: 'Patient ID' },
      { name: 'startDate', type: 'string (YYYY-MM-DD)', required: false, description: 'Filter by start date' },
      { name: 'endDate', type: 'string (YYYY-MM-DD)', required: false, description: 'Filter by end date' }
    ],
    responseExample: '{ "success": true, "totalCount": 5, "visits": [{ "id": "VST123", "date": "2023-05-10", "doctor": "Dr. John", "type": "General Checkup" }] }',
    docLink: 'https://docs.emr-provider.com/api/fetchVisits'
  },
  {
    name: 'fetchLabReports', 
    description: 'Fetch lab reports for a visit',
    method: "POST",
    parameters: [
      { name: 'visitId', type: 'string', required: true, description: 'Visit ID' }
    ],
    responseExample: '{ "success": true, "reports": [{ "id": "LAB123", "type": "Blood Test", "date": "2023-05-11", "results": [{ "parameter": "Hemoglobin", "value": "14.2", "unit": "g/dL", "normalRange": "13.5-17.5" }] }] }',
    docLink: 'https://docs.emr-provider.com/api/fetchLabReports'
  },
  {
    name: 'fetchPatientMedications', 
    description: 'Fetch medications prescribed in a visit',
    method: "POST",
    parameters: [
      { name: 'visitId', type: 'string', required: true, description: 'Visit ID' }
    ],
    responseExample: '{ "success": true, "medications": [{ "id": "MED123", "name": "Amoxicillin", "dosage": "500mg", "frequency": "3 times daily", "duration": "5 days" }] }',
    docLink: 'https://docs.emr-provider.com/api/fetchPatientMedications'
  }
];

const EHRApiEndpoints = () => {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const toggleEndpoint = (endpointName: string) => {
    if (expandedEndpoint === endpointName) {
      setExpandedEndpoint(null);
    } else {
      setExpandedEndpoint(endpointName);
    }
  };

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        The following API endpoints are available for integration with your EHR system.
        Click on any endpoint to see detailed documentation.
      </p>
      
      <div className="space-y-4">
        {apiEndpoints.map((endpoint) => (
          <div key={endpoint.name} className="border rounded-md overflow-hidden bg-white">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleEndpoint(endpoint.name)}
            >
              <div className="flex items-center gap-4">
                <Badge className={endpoint.method === "GET" ? "bg-blue-500" : "bg-green-500"}>
                  {endpoint.method}
                </Badge>
                <div>
                  <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
                  <p className="text-sm text-gray-500">{endpoint.description}</p>
                </div>
              </div>
              <div>
                {expandedEndpoint === endpoint.name ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedEndpoint === endpoint.name && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Parameters</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Name</TableHead>
                      <TableHead className="w-1/5">Type</TableHead>
                      <TableHead className="w-1/5">Required</TableHead>
                      <TableHead className="w-2/5">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoint.parameters.map((param) => (
                      <TableRow key={param.name}>
                        <TableCell className="font-mono">{param.name}</TableCell>
                        <TableCell>{param.type}</TableCell>
                        <TableCell>{param.required ? "Yes" : "No"}</TableCell>
                        <TableCell>{param.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <h4 className="text-sm font-medium mt-4 mb-2">Response Example</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto">
                  {endpoint.responseExample}
                </pre>
                
                <div className="mt-4 flex justify-end">
                  <a 
                    href={endpoint.docLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      Complete Documentation
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mt-6">
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
            <p className="text-sm mt-2">
              All API requests should include your API key in the <code className="bg-blue-100 px-1 rounded">token</code> header.
              Responses are returned in JSON format.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EHRApiEndpoints;
