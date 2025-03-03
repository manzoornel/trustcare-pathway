
import { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FileText, Pill, ClipboardList, Calendar } from "lucide-react";

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState("labReports");

  // Sample data - in a real app, this would come from a database
  const labReports = [
    { id: 1, name: "Complete Blood Count", date: "2023-12-15", status: "Completed", doctor: "Dr. Sarah Johnson" },
    { id: 2, name: "Lipid Profile", date: "2023-11-20", status: "Completed", doctor: "Dr. Michael Chen" },
    { id: 3, name: "Thyroid Function Test", date: "2023-10-05", status: "Completed", doctor: "Dr. Sarah Johnson" },
  ];

  const medications = [
    { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "2023-12-10", doctor: "Dr. James Wilson" },
    { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "2023-11-15", doctor: "Dr. Sarah Johnson" },
    { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", prescribed: "2023-10-20", doctor: "Dr. Michael Chen" },
  ];

  const medicalSummaries = [
    { id: 1, type: "Annual Checkup", date: "2023-12-01", doctor: "Dr. Sarah Johnson", notes: "Patient is in good health. Recommended regular exercise and balanced diet." },
    { id: 2, type: "Specialist Consult", date: "2023-09-15", doctor: "Dr. Michael Chen", notes: "Reviewed cardiac health. No significant issues detected. Continue with current medication regimen." },
    { id: 3, type: "Follow-up", date: "2023-08-10", doctor: "Dr. James Wilson", notes: "Diabetes well-managed. Adjusted medication dosage slightly. Schedule follow-up in 3 months." },
  ];

  const appointments = [
    { id: 1, type: "Regular Checkup", date: "2024-02-15", time: "10:30 AM", doctor: "Dr. Sarah Johnson", status: "Upcoming" },
    { id: 2, type: "Dental Cleaning", date: "2024-01-20", time: "2:00 PM", doctor: "Dr. Lisa Patel", status: "Upcoming" },
    { id: 3, type: "Follow-up", date: "2023-12-05", time: "11:15 AM", doctor: "Dr. Michael Chen", status: "Completed" },
  ];

  return (
    <>
      <Helmet>
        <title>Patient Portal | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Access your medical records, lab reports, medications, and appointments at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Patient Portal</h1>
            <p className="text-gray-600 mb-8">
              View your medical records, lab reports, medication history, and upcoming appointments.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="labReports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Lab Reports</span>
                </TabsTrigger>
                <TabsTrigger value="medications" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Medications</span>
                </TabsTrigger>
                <TabsTrigger value="medicalSummary" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Medical Summary</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Appointments</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="labReports" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="medicalSummary" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      Your upcoming and past appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-3 border-b">Type</th>
                            <th className="text-left p-3 border-b">Date</th>
                            <th className="text-left p-3 border-b">Time</th>
                            <th className="text-left p-3 border-b">Doctor</th>
                            <th className="text-left p-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment) => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                              <td className="p-3 border-b">{appointment.type}</td>
                              <td className="p-3 border-b">{appointment.date}</td>
                              <td className="p-3 border-b">{appointment.time}</td>
                              <td className="p-3 border-b">{appointment.doctor}</td>
                              <td className="p-3 border-b">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  appointment.status === "Upcoming" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PatientPortal;
