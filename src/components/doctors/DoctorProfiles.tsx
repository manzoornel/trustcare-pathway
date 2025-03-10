
import { doctors } from './DoctorData';
import DoctorCard from './DoctorCard';
import { DoctorProfile } from './types';
import { Link } from 'react-router-dom';

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
    if (a.name.includes("Manzoor Nellancheri")) return -1;
    if (b.name.includes("Manzoor Nellancheri")) return 1;
    return 0;
  });

  // Filter doctors if featuredOnly is true
  const displayedDoctors = featuredOnly 
    ? sortedDoctors.slice(0, 3) // Show only first 3 doctors when featured
    : sortedDoctors;

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Experts</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the experienced physicians behind Doctor Uncle Family Clinic, committed to providing you with the best care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {displayedDoctors.map((doctor, index) => (
            <div key={index} className="flex justify-center">
              <DoctorCard 
                doctor={doctor} 
              />
            </div>
          ))}
        </div>
        
        {featuredOnly && displayedDoctors.length > 0 && (
          <div className="text-center mt-16">
            <Link 
              to="/doctors" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              View All Doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfiles;
