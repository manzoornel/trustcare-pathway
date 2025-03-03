
import { Application } from "./types";

export const mockApplications: Application[] = [
  {
    id: 1,
    name: "John Smith",
    email: "johnsmith@example.com",
    phone: "+91 98765 43210",
    category: "Doctors",
    position: "General Physician",
    dateApplied: "2024-04-10",
    status: "new",
    education: "MBBS from Mumbai Medical College, MD in General Medicine",
    experience: "5 years at City Hospital as Resident Doctor"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarahj@example.com",
    phone: "+91 98765 12345",
    category: "Nursing Staff",
    position: "Head Nurse",
    dateApplied: "2024-04-08",
    status: "reviewed",
    education: "BSc Nursing from Delhi Nursing College",
    experience: "8 years experience in multispecialty hospital"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michaelb@example.com",
    phone: "+91 87654 32109",
    category: "Administrative Staff",
    position: "Office Manager",
    dateApplied: "2024-04-05",
    status: "shortlisted",
    education: "MBA in Healthcare Management",
    experience: "4 years as admin coordinator at Health Plus Clinic"
  }
];
