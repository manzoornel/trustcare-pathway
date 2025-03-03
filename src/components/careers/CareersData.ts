
export type JobPosition = {
  id: string;
  title: string;
};

export type JobCategory = {
  id: string;
  title: string;
  positions: JobPosition[];
  description: string;
  requirements: string;
};

export const jobCategories: JobCategory[] = [
  {
    id: "doctor",
    title: "Doctors",
    positions: [
      { id: "general-physician", title: "General Physician" },
      { id: "pediatrician", title: "Pediatrician" },
      { id: "cardiologist", title: "Cardiologist" },
      { id: "gynecologist", title: "Gynecologist" },
      { id: "neurologist", title: "Neurologist" },
      { id: "pulmonologist", title: "Pulmonologist" },
      { id: "ent-specialist", title: "ENT Specialist" },
      { id: "surgeon", title: "Surgeon" },
      { id: "ophthalmologist", title: "Ophthalmologist" },
      { id: "dermatologist", title: "Dermatologist" },
      { id: "radiologist", title: "Radiologist" },
      { id: "orthopedician", title: "Orthopedician" },
      { id: "rmo", title: "Resident Medical Officer (RMO)" },
    ],
    description:
      "Join our team of medical professionals dedicated to providing exceptional patient care.",
    requirements: "MBBS/MD with relevant specialization and valid medical license.",
  },
  {
    id: "nurse",
    title: "Nursing Staff",
    positions: [
      { id: "head-nurse", title: "Head Nurse" },
      { id: "staff-nurse", title: "Staff Nurse" },
      { id: "nursing-assistant", title: "Nursing Assistant" },
    ],
    description:
      "Be part of our nursing team that provides compassionate and quality care to our patients.",
    requirements: "Nursing degree/diploma with relevant experience and registration.",
  },
  {
    id: "admin",
    title: "Administrative Staff",
    positions: [
      { id: "receptionist", title: "Receptionist" },
      { id: "office-manager", title: "Office Manager" },
      { id: "medical-records", title: "Medical Records Officer" },
    ],
    description:
      "Help us maintain efficient clinic operations and provide excellent service to our patients.",
    requirements: "High school diploma or equivalent, computer proficiency, and customer service skills.",
  },
  {
    id: "tech",
    title: "Technical Staff",
    positions: [
      { id: "lab-technician", title: "Laboratory Technician" },
      { id: "radiographer", title: "Radiographer" },
      { id: "pharmacist", title: "Pharmacist" },
    ],
    description:
      "Support our clinical services with your technical expertise and ensure accurate diagnostics.",
    requirements: "Relevant technical degree/diploma and certification in the respective field.",
  },
];
