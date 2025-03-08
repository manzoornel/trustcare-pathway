
export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  education: string;
  description: string;
  specializations: string[];
  highlights: string[];
  image?: string;
  experience?: string;
  languages?: string[];
  availableDays?: string[];
  featured?: boolean;
}
