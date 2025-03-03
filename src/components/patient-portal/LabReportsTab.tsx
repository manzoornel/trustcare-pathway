
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Sample data for lab reports
const labReports = [
  { id: 1, name: "Complete Blood Count", date: "2023-12-15", status: "Completed", doctor: "Dr. Sarah Johnson" },
  { id: 2, name: "Lipid Profile", date: "2023-11-20", status: "Completed", doctor: "Dr. Michael Chen" },
  { id: 3, name: "Thyroid Function Test", date: "2023-10-05", status: "Completed", doctor: "Dr. Sarah Johnson" },
];

const LabReportsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Reports</CardTitle>
        <CardDescription>
          View all your laboratory test results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border-b">Test Name</th>
                <th className="text-left p-3 border-b">Date</th>
                <th className="text-left p-3 border-b">Status</th>
                <th className="text-left p-3 border-b">Doctor</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{report.name}</td>
                  <td className="p-3 border-b">{report.date}</td>
                  <td className="p-3 border-b">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">{report.doctor}</td>
                  <td className="p-3 border-b">
                    <button className="text-primary hover:underline text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabReportsTab;
