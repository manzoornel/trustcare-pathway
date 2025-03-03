
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Sample data for medications
const medications = [
  { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "2023-12-10", doctor: "Dr. James Wilson" },
  { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "2023-11-15", doctor: "Dr. Sarah Johnson" },
  { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", prescribed: "2023-10-20", doctor: "Dr. Michael Chen" },
];

const MedicationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication History</CardTitle>
        <CardDescription>
          Your current and past medication details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border-b">Medication</th>
                <th className="text-left p-3 border-b">Dosage</th>
                <th className="text-left p-3 border-b">Frequency</th>
                <th className="text-left p-3 border-b">Prescribed</th>
                <th className="text-left p-3 border-b">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((medication) => (
                <tr key={medication.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{medication.name}</td>
                  <td className="p-3 border-b">{medication.dosage}</td>
                  <td className="p-3 border-b">{medication.frequency}</td>
                  <td className="p-3 border-b">{medication.prescribed}</td>
                  <td className="p-3 border-b">{medication.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsTab;
