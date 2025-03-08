
import { doctors } from './DoctorData';
import DoctorCard from './DoctorCard';
import { DoctorProfile } from './types';

interface DoctorProfilesProps {
  featuredOnly?: boolean;
}

const DoctorProfiles = ({ featuredOnly = true }: DoctorProfilesProps) => {
  // Convert Doctor data to DoctorProfile format
  const doctorProfiles: DoctorProfile[] = doctors.map(doctor => ({
    name: doctor.name,
    title: doctor.qualification,
    specialty: doctor.specialty,
    experience: doctor.experience,
    education: doctor.qualification,
    description: doctor.bio,
    image: doctor.image,
    specializations: doctor.languages || [],
    highlights: doctor.availableDays || [],
    clinicInfo: {
      location: "Doctor Uncle Family Clinic",
      contact: "+1-234-567-8900",
    }
  }));

  // Sort doctors to put Dr. Manzoor first
  const sortedDoctors = [...doctorProfiles].sort((a, b) => {
    if (a.name.includes("Manzoor")) return -1;
    if (b.name.includes("Manzoor")) return 1;
    return 0;
  });

  // Filter doctors if featuredOnly is true
  const displayedDoctors = featuredOnly 
    ? sortedDoctors.slice(0, 3) // Show only first 3 doctors when featured
    : sortedDoctors;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Medical Experts</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the experienced physicians behind Doctor Uncle Family Clinic, committed to providing you with the best care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDoctors.map((doctor, index) => (
            <DoctorCard 
              key={index}
              doctor={doctor} 
            />
          ))}
        </div>
        
        {featuredOnly && displayedDoctors.length > 0 && (
          <div className="text-center mt-10">
            <a 
              href="/doctors" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Doctors
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfiles;
