
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
    id: "dr-jismia-k",
    name: "Dr. Jismia K",
    specialty: "General Practitioner",
    bio: "Dr. Jismia K (MBBS, TCMS 72852) is a dedicated General Practitioner committed to providing comprehensive healthcare for your entire family. With a patient-centric approach, she focuses on preventive care, diagnosis, and treatment of common illnesses. Expert care, round-the-clock availability for emergencies, and a compassionate approach to family health.",
    image: "/placeholder.svg",
    qualification: "MBBS, TCMS 72852",
    experience: "24-hour on call",
    languages: ["English", "Malayalam"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    featured: true
  },
  {
    id: "dr-rauoof-k",
    name: "Dr. Rauoof K",
    specialty: "General Practitioner",
    bio: "Dr. Rauoof K (MBBS) is an experienced General Practitioner offering essential medical services during the evening and night hours. He is dedicated to addressing urgent health concerns and providing continuous care for the community. Reliable night-time consultations and accessible primary care for all your immediate health needs.",
    image: "/placeholder.svg",
    qualification: "MBBS",
    experience: "Night consultations",
    languages: ["English", "Malayalam"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    featured: true
  },
  
  // Gynecology Department
  {
    id: "dr-shaflia",
    name: "Dr. Shaflia",
    specialty: "Consultant Obstetrician and Gynecologist",
    bio: "Dr. Shaflia (MBBS, MS (OBG), FMAS) is a highly skilled Consultant Obstetrician and Gynecologist. She provides expert care for women's health, covering everything from prenatal care and childbirth to gynecological conditions and minimally invasive surgeries. Specialized care for women's health, including obstetrics and gynecology, ensuring comprehensive and compassionate treatment.",
    image: "/placeholder.svg",
    qualification: "MBBS, MS (OBG), FMAS",
    experience: "Specialized women's health",
    languages: ["English", "Malayalam"],
    availableDays: ["Monday", "Thursday"],
    featured: true
  },

  // Diabetes & Thyroid Department
  {
    id: "dr-iqbal-kotta",
    name: "Dr. Iqbal Kotta",
    specialty: "General Medicine (Diabetes & Thyroid Specialist)",
    bio: "Dr. Iqbal Kotta (MBBS, MD General Medicine, TCMC 55965) specializes in the diagnosis and management of diabetes and thyroid disorders. He offers personalized treatment plans to help patients effectively manage their conditions and improve their quality of life. Expert management of diabetes and thyroid conditions with a focus on patient-specific care.",
    image: "/placeholder.svg",
    qualification: "MBBS, MD General Medicine, TCMC 55965",
    experience: "Diabetes & Thyroid specialist",
    languages: ["English", "Malayalam"],
    availableDays: ["Tuesday"],
    featured: false
  },

  // Diabetics & Pain Management
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
    id: "dr-mansheer-nellancheri",
    name: "Dr. Mansheer Nellancheri",
    specialty: "ENT Specialist",
    bio: "Dr. Mansheer Nellancheri (MBBS, Dip ENT) is a visiting ENT specialist at Doctor Uncle Family Clinic, available for consultations by appointment. He provides specialized care for various ear, nose, and throat conditions. Convenient appointment-based consultations for specialized ENT care.",
    image: "/placeholder.svg",
    qualification: "MBBS, Dip ENT",
    experience: "Visiting ENT specialist",
    languages: ["English", "Malayalam"],
    availableDays: ["Sunday"],
    featured: false
  },

  // Skin & Cosmetology Department
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
  return doctors.filter(doctor => doctor.featured);
};

export const getAllDoctors = (): Doctor[] => {
  return doctors;
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};
