
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar, Clock, UserCircle } from "lucide-react";

// Updated sample data for appointments with real doctor names
const appointments = [
  { 
    id: 1, 
    type: "General Checkup", 
    date: "2024-07-15", 
    time: "10:30 AM", 
    doctor: "Dr. Shameem Samad PK", 
    status: "Upcoming",
    location: "Vakkad Branch"
  },
  { 
    id: 2, 
    type: "Skin Consultation", 
    date: "2024-07-20", 
    time: "2:00 PM", 
    doctor: "Dr. Praveen V", 
    status: "Upcoming",
    location: "Vakkad Branch"
  },
  { 
    id: 3, 
    type: "Follow-up", 
    date: "2024-06-25", 
    time: "11:15 AM", 
    doctor: "Dr. Manzoor Nellancheri", 
    status: "Completed",
    location: "Unniyal Branch" 
  },
  { 
    id: 4, 
    type: "ENT Consultation", 
    date: "2024-06-18", 
    time: "3:30 PM", 
    doctor: "Dr. Shahar Banu", 
    status: "Completed",
    location: "Vakkad Branch" 
  },
];

const AppointmentsTab = () => {
  return (
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
                <th className="text-left p-3 border-b">Location</th>
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
                  <td className="p-3 border-b">{appointment.location}</td>
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
  );
};

export default AppointmentsTab;
