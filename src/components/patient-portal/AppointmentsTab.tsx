
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Appointment = {
  id: string;
  type: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  location: string;
};

const AppointmentsTab = () => {
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!auth.userId) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', auth.userId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // If no appointments yet, insert demo data
        if (!data || data.length === 0) {
          await insertDemoAppointments(auth.userId);
        } else {
          setAppointments(data as Appointment[]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Could not load appointments");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [auth.userId]);

  // Function to insert demo appointments for new users
  const insertDemoAppointments = async (userId: string) => {
    try {
      const demoAppointments = [
        { 
          patient_id: userId,
          type: "General Checkup", 
          date: "2024-07-15", 
          time: "10:30 AM", 
          doctor: "Dr. Shameem Samad PK", 
          status: "Upcoming",
          location: "Vakkad Branch"
        },
        { 
          patient_id: userId,
          type: "Skin Consultation", 
          date: "2024-07-20", 
          time: "2:00 PM", 
          doctor: "Dr. Praveen V", 
          status: "Upcoming",
          location: "Vakkad Branch"
        },
        { 
          patient_id: userId,
          type: "Follow-up", 
          date: "2024-06-25", 
          time: "11:15 AM", 
          doctor: "Dr. Manzoor Nellancheri", 
          status: "Completed",
          location: "Unniyal Branch" 
        },
        { 
          patient_id: userId,
          type: "ENT Consultation", 
          date: "2024-06-18", 
          time: "3:30 PM", 
          doctor: "Dr. Shahar Banu", 
          status: "Completed",
          location: "Vakkad Branch" 
        },
      ];
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(demoAppointments)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setAppointments(data as Appointment[]);
      }
    } catch (error) {
      console.error("Error inserting demo appointments:", error);
    }
  };

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
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
