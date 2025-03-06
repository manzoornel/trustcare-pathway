import { doctors } from './DoctorData';
import DoctorCard from './DoctorCard';

interface DoctorProfilesProps {
  featuredOnly?: boolean;
}

const DoctorProfiles = ({ featuredOnly = true }: DoctorProfilesProps) => {
  // Sort doctors to put Dr. Manzoor first
  const sortedDoctors = [...doctors].sort((a, b) => {
    if (a.id === "dr-manzoor") return -1;
    if (b.id === "dr-manzoor") return 1;
    return 0;
  });

  // Filter doctors if featuredOnly is true
  const displayedDoctors = featuredOnly 
    ? sortedDoctors.filter(doctor => doctor.featured)
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
          {displayedDoctors.map((doctor) => (
            <DoctorCard 
              key={doctor.id}
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
