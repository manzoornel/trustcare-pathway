// Mock data for lab reports
export const mockLabReports = [
  {
    id: "1",
    date: "2023-11-15",
    type: "Blood Test",
    doctor: "Dr. Sharma",
    status: "Completed",
    results: [
      {
        parameter: "Hemoglobin",
        value: 14.2,
        unit: "g/dL",
        normalRange: "13.5-17.5",
      },
      {
        parameter: "WBC",
        value: 6.8,
        unit: "10^3/µL",
        normalRange: "4.5-11.0",
      },
      { parameter: "RBC", value: 5.1, unit: "10^6/µL", normalRange: "4.5-5.9" },
      {
        parameter: "Platelets",
        value: 250,
        unit: "10^3/µL",
        normalRange: "150-450",
      },
      { parameter: "Glucose", value: 88, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
  {
    id: "2",
    date: "2023-09-03",
    type: "Blood Test",
    doctor: "Dr. Patel",
    status: "Completed",
    results: [
      {
        parameter: "Hemoglobin",
        value: 13.8,
        unit: "g/dL",
        normalRange: "13.5-17.5",
      },
      {
        parameter: "WBC",
        value: 7.2,
        unit: "10^3/µL",
        normalRange: "4.5-11.0",
      },
      { parameter: "RBC", value: 4.9, unit: "10^6/µL", normalRange: "4.5-5.9" },
      {
        parameter: "Platelets",
        value: 230,
        unit: "10^3/µL",
        normalRange: "150-450",
      },
      { parameter: "Glucose", value: 95, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
  {
    id: "3",
    date: "2023-06-22",
    type: "Lipid Panel",
    doctor: "Dr. Sharma",
    status: "Completed",
    results: [
      {
        parameter: "Total Cholesterol",
        value: 185,
        unit: "mg/dL",
        normalRange: "<200",
      },
      { parameter: "HDL", value: 55, unit: "mg/dL", normalRange: ">40" },
      { parameter: "LDL", value: 110, unit: "mg/dL", normalRange: "<130" },
      {
        parameter: "Triglycerides",
        value: 100,
        unit: "mg/dL",
        normalRange: "<150",
      },
    ],
  },
  {
    id: "4",
    date: "2023-02-10",
    type: "Blood Test",
    doctor: "Dr. Kumar",
    status: "Completed",
    results: [
      {
        parameter: "Hemoglobin",
        value: 13.5,
        unit: "g/dL",
        normalRange: "13.5-17.5",
      },
      {
        parameter: "WBC",
        value: 8.1,
        unit: "10^3/µL",
        normalRange: "4.5-11.0",
      },
      { parameter: "RBC", value: 4.7, unit: "10^6/µL", normalRange: "4.5-5.9" },
      {
        parameter: "Platelets",
        value: 210,
        unit: "10^3/µL",
        normalRange: "150-450",
      },
      { parameter: "Glucose", value: 98, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
];

// Type definitions for lab reports
export interface LabResult {
  parameter: string;
  value: number;
  unit: string;
  normalRange: string;
}

export interface LabReport {
  id: string;
  date: string;
  type: string;
  doctor: string;
  status: string;
  results: LabResult[];
  visitId: any;
}
