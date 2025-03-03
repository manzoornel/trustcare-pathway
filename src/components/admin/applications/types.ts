
export type ApplicationStatus = "new" | "reviewed" | "shortlisted" | "rejected";

export interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  position: string;
  dateApplied: string;
  status: ApplicationStatus;
  resume?: string;
  coverLetter?: string;
  education?: string;
  experience?: string;
}
