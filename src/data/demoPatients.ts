
import { DemoPatient } from "@/types/auth.types";

// Demo patients that can be used for quick login
export const demoPatients: DemoPatient[] = [
  {
    name: "John Smith",
    hospitalId: "H12345",
    email: "john.smith@example.com",
    password: "password123",
    phone: "1234567890"
  },
  {
    name: "Sarah Johnson",
    hospitalId: "H67890",
    email: "sarah.johnson@example.com",
    password: "password123",
    phone: "9876543210"
  }
];

// Utility function to get a demo patient by email
export const getDemoPatient = (email: string): DemoPatient | undefined => {
  return demoPatients.find(patient => patient.email === email);
};
