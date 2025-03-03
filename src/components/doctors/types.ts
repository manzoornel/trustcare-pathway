
export interface ClinicInformation {
  location: string;
  timing?: string;
  contact: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  specialty: string;
  experience: string;
  education: string;
  description: string;
  image: string;
  specializations: string[];
  highlights: string[];
  clinicInfo?: ClinicInformation;
}

export interface EntDoctorProfile {
  name: string;
  title: string;
  specialty: string;
  description: string;
  image: string;
  specializations: string[];
  clinicInfo: ClinicInformation;
}
