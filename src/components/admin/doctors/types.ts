
export interface DoctorFormData {
  id?: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  image: string;
  bio: string;
  languages: string[];
  availableDays: string[];
  featured: boolean;
}
