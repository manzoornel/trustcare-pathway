
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Sample data for medical summaries
const medicalSummaries = [
  { id: 1, type: "Annual Checkup", date: "2023-12-01", doctor: "Dr. Sarah Johnson", notes: "Patient is in good health. Recommended regular exercise and balanced diet." },
  { id: 2, type: "Specialist Consult", date: "2023-09-15", doctor: "Dr. Michael Chen", notes: "Reviewed cardiac health. No significant issues detected. Continue with current medication regimen." },
  { id: 3, type: "Follow-up", date: "2023-08-10", doctor: "Dr. James Wilson", notes: "Diabetes well-managed. Adjusted medication dosage slightly. Schedule follow-up in 3 months." },
];

const MedicalSummaryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Summary</CardTitle>
        <CardDescription>
          Summary of your past visits and consultations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalSummaries.map((summary) => (
            <div key={summary.id} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{summary.type}</h3>
                <span className="text-sm text-gray-500">{summary.date}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">Doctor: {summary.doctor}</p>
              <p className="text-sm">{summary.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalSummaryTab;
