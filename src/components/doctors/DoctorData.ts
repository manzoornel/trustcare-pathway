export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  qualification: string;
  experience: string;
  languages: string[];
  availableDays: string[];
  featured: boolean;
}

// Mock data for doctors in the clinic
export const doctors: Doctor[] = [
  {
    id: "dr-manzoor",
    name: "Dr. Manzoor Nellancheri",
    specialty: "Family Medicine & Founder",
    bio: "Dr. Manzoor Nellancheri is a highly experienced family physician with over 20 years of practice. As the founder of Doctor Uncle Family Clinic, he has built a reputation for providing compassionate, patient-centered care to families across all generations.",
    image: "/lovable-uploads/84716f55-3da5-45a6-bb8f-5c84e1a8b6fa.png",
    qualification: "MBBS, MD (Family Medicine)",
    experience: "20+ years",
    languages: ["English", "Hindi", "Urdu", "Malayalam"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    featured: true,
  },
  {
    id: "dr-shameem",
    name: "Dr. Shameem Samad PK",
    specialty: "Pediatrics",
    bio: "Dr. Shameem specializes in the care of infants, children, and adolescents. With a gentle approach and expertise in childhood development, she ensures your children receive the best care from birth through their teenage years.",
    image: "/lovable-uploads/5b0045c2-3301-401d-9d16-faf9110a47bf.png",
    qualification: "MBBS, MD (Pediatrics)",
    experience: "12 years",
    languages: ["English", "Hindi", "Malayalam"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: true,
  },
  {
    id: "dr-wazeem",
    name: "Dr. Wazeem",
    specialty: "Internal Medicine",
    bio: "Dr. Wazeem is dedicated to providing comprehensive care for adults with complex medical conditions. He specializes in preventive care and managing chronic diseases such as diabetes, hypertension, and heart disease.",
    image: "/lovable-uploads/1aff5afe-1070-44a1-8b38-24f7962a7840.png",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: "15 years",
    languages: ["English", "Hindi", "Malayalam"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    featured: true,
  },
  {
    id: "dr-praveen",
    name: "Dr. Praveen V",
    specialty: "Dermatology",
    bio: "Dr. Praveen is committed to dermatological care throughout all stages of life. From routine skin check-ups to managing complex skin conditions, he provides compassionate and comprehensive dermatological services.",
    image: "/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png",
    qualification: "MBBS, MD (Dermatology)",
    experience: "10 years",
    languages: ["English", "Malayalam", "Tamil"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: false,
  },
  {
    id: "dr-shaharban",
    name: "Dr. Shahar Banu",
    specialty: "ENT Specialist",
    bio: "Dr. Shahar Banu specializes in diagnosing and treating ear, nose, and throat conditions for patients of all ages. Her expertise includes hearing disorders, sinus problems, voice disorders, and pediatric ENT care.",
    image: "/lovable-uploads/88954829-a127-4367-854f-7771675d8c03.png",
    qualification: "MBBS, MS (ENT)",
    experience: "8 years",
    languages: ["English", "Malayalam", "Hindi"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    featured: false,
  },
  {
    id: "dr-mansheer",
    name: "Dr. Mansheer Nellancheri",
    specialty: "General Medicine",
    bio: "Dr. Mansheer Nellancheri helps patients achieve their health goals through personalized care plans. He specializes in managing various conditions including diabetes, respiratory disorders, and digestive issues.",
    image: "/lovable-uploads/b43b47a5-cb17-407e-a024-0919f8f22ad4.png",
    qualification: "MBBS, MD (General Medicine)",
    experience: "7 years",
    languages: ["English", "Hindi", "Malayalam"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: false,
  },
  {
    id: "dr-vijay",
    name: "Dr. Vijay S",
    specialty: "Orthopedics",
    bio: "Dr. Vijay S specializes in orthopedic care, focusing on bone and joint conditions. With his expertise in both surgical and non-surgical treatments, he provides comprehensive care for patients with musculoskeletal issues.",
    image: "/lovable-uploads/54ce09cc-73b7-4e3a-abdc-fedcc93cc51c.png",
    qualification: "MBBS, MS (Orthopedics)",
    experience: "9 years",
    languages: ["English", "Malayalam", "Tamil"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    featured: false,
  },
];

// Helper functions to access doctor data
export const getFeaturedDoctors = (): Doctor[] => {
  return doctors.filter((doctor) => doctor.featured);
};

export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id);
};
