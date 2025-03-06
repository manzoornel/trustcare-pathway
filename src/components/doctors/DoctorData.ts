
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
    name: "Dr. Manzoor Ahmed",
    specialty: "Family Medicine & Founder",
    bio: "Dr. Manzoor Ahmed is a highly experienced family physician with over 20 years of practice. As the founder of Doctor Uncle Family Clinic, he has built a reputation for providing compassionate, patient-centered care to families across all generations.",
    image: "/lovable-uploads/84716f55-3da5-45a6-bb8f-5c84e1a8b6fa.png",
    qualification: "MBBS, MD (Family Medicine)",
    experience: "20+ years",
    languages: ["English", "Hindi", "Urdu", "Malayalam"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    featured: true
  },
  {
    id: "dr-sarah",
    name: "Dr. Sarah Johnson",
    specialty: "Pediatrics",
    bio: "Dr. Sarah specializes in the care of infants, children, and adolescents. With her gentle approach and expertise in childhood development, she ensures your children receive the best care from birth through their teenage years.",
    image: "/lovable-uploads/5b0045c2-3301-401d-9d16-faf9110a47bf.png",
    qualification: "MBBS, MD (Pediatrics)",
    experience: "12 years",
    languages: ["English", "Hindi"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: true
  },
  {
    id: "dr-raj",
    name: "Dr. Raj Patel",
    specialty: "Internal Medicine",
    bio: "Dr. Raj is dedicated to providing comprehensive care for adults with complex medical conditions. He specializes in preventive care and managing chronic diseases such as diabetes, hypertension, and heart disease.",
    image: "/lovable-uploads/1aff5afe-1070-44a1-8b38-24f7962a7840.png",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: "15 years",
    languages: ["English", "Hindi", "Gujarati"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    featured: true
  },
  {
    id: "dr-fatima",
    name: "Dr. Fatima Khan",
    specialty: "OB/GYN",
    bio: "Dr. Fatima is committed to women's health throughout all stages of life. From routine check-ups to prenatal care and managing menopausal symptoms, she provides compassionate and comprehensive gynecological services.",
    image: "/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png",
    qualification: "MBBS, MD (Obstetrics & Gynecology)",
    experience: "10 years",
    languages: ["English", "Hindi", "Urdu"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: false
  },
  {
    id: "dr-james",
    name: "Dr. James Wilson",
    specialty: "Dermatology",
    bio: "Dr. James specializes in diagnosing and treating skin conditions for patients of all ages. His expertise includes acne, eczema, psoriasis, skin cancer screenings, and cosmetic dermatology.",
    image: "/lovable-uploads/88954829-a127-4367-854f-7771675d8c03.png",
    qualification: "MBBS, MD (Dermatology)",
    experience: "8 years",
    languages: ["English"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    featured: false
  },
  {
    id: "dr-ananya",
    name: "Dr. Ananya Desai",
    specialty: "Nutrition & Dietetics",
    bio: "Dr. Ananya helps patients achieve their health goals through personalized nutrition plans. She specializes in dietary management for various conditions including diabetes, weight management, and digestive disorders.",
    image: "/lovable-uploads/b43b47a5-cb17-407e-a024-0919f8f22ad4.png",
    qualification: "PhD in Nutrition, Registered Dietitian",
    experience: "7 years",
    languages: ["English", "Hindi", "Marathi"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: false
  }
];

export const getFeaturedDoctors = (): Doctor[] => {
  return doctors.filter(doctor => doctor.featured);
};

export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};
