
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";

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
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Appointments
        </CardTitle>
        <CardDescription>
          Your upcoming and past appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`p-4 rounded-lg border ${
                appointment.status === "Upcoming" 
                  ? "border-blue-100 bg-blue-50" 
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{appointment.type}</h3>
                <Badge 
                  className={`${
                    appointment.status === "Upcoming" 
                      ? "bg-blue-100 hover:bg-blue-100 text-blue-800" 
                      : "bg-green-100 hover:bg-green-100 text-green-800"
                  }`}
                >
                  {appointment.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>{appointment.date}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{appointment.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{appointment.doctor}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
