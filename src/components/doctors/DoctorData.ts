
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
  // General Practice Department
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

  // Gynecology Department
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
    featured: false
  },
  {
    id: "dr-manzoor-n",
    name: "Dr. Manzoor N",
    specialty: "Diabetology (CCEDM) & Pain and Palliative Care (BCCPM)",
    bio: "Dr. Manzoor N (MBBS, CCEDM (Diabetology), BCCPM (Pain & Palliative)) brings a dual expertise in managing diabetes and providing effective pain and palliative care. His holistic approach aims to improve patient comfort and overall well-being. Comprehensive care for diabetes management combined with compassionate pain and palliative support, offering a unique and integrated approach to your health.",
    image: "/placeholder.svg",
    qualification: "MBBS, CCEDM (Diabetology), BCCPM (Pain & Palliative)",
    experience: "Diabetes & Pain management",
    languages: ["English", "Malayalam", "Hindi"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    featured: true
  },

  // ENT Department
  {
    id: "dr-shaharbana",
    name: "Dr. Shaharbana",
    specialty: "ENT Specialist",
    bio: "Dr. Shaharbana (MBBS, MS ENT) is an experienced ENT specialist providing expert care for conditions related to the ear, nose, and throat. From common infections to complex issues, she offers thorough diagnosis and effective treatment. Dedicated and precise care for all your ear, nose, and throat concerns.",
    image: "/placeholder.svg",
    qualification: "MBBS, MS ENT",
    experience: "ENT specialist",
    languages: ["English", "Malayalam"],
    availableDays: ["Thursday", "Saturday"],
    featured: false
  },
  {
    id: "dr-vijay-singh",
    name: "Dr. Vijay Singh",
    specialty: "ENT Surgeon",
    bio: "Dr. Vijay Singh (MBBS, DLO, MS ENT Surgeon) is a skilled ENT surgeon offering both medical and surgical solutions for ear, nose, and throat conditions. He is committed to improving patient outcomes through expert interventions. Expertise in ENT surgery and comprehensive medical treatment for ENT issues.",
    image: "/placeholder.svg",
    qualification: "MBBS, DLO, MS ENT Surgeon",
    experience: "ENT surgery specialist",
    languages: ["English", "Hindi"],
    availableDays: ["Tuesday"],
    featured: false
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
    featured: false
  },
  {
    id: "dr-praveen-p",
    name: "Dr. Praveen P",
    specialty: "Dermatology",
    bio: "Dr. Praveen P (MBBS, MD, DVD Dermatology) is a specialist in skin and cosmetology. He offers a wide range of services, including diagnosis and treatment of skin conditions, as well as cosmetic procedures to enhance skin health and appearance. Expert dermatological care and advanced cosmetology services for healthy and radiant skin.",
    image: "/placeholder.svg",
    qualification: "MBBS, MD, DVD Dermatology",
    experience: "Dermatology & Cosmetology",
    languages: ["English", "Malayalam"],
    availableDays: ["Friday"],
    featured: false
  },

  // Pediatric Department
  {
    id: "dr-waseem",
    name: "Dr. Waseem",
    specialty: "Consultant Pediatrician",
    bio: "Dr. Waseem (MBBS/MD/FNNF) is a dedicated Consultant Pediatrician focused on the health and well-being of children. He provides comprehensive medical care for infants, children, and adolescents, from routine check-ups to managing childhood illnesses. Compassionate and expert pediatric care for your child's growth and health needs.",
    image: "/placeholder.svg",
    qualification: "MBBS/MD/FNNF",
    experience: "Pediatric specialist",
    languages: ["English", "Malayalam"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    featured: true
  }
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
