
import { doctors, entDoctors } from './DoctorData';
import DoctorCard from './DoctorCard';
import EntDoctorCard from './EntDoctorCard';
import EntCareBenefits from './EntCareBenefits';

const DoctorProfiles = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Medical Experts</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the experienced physicians behind Doctor Uncle Family Clinic, committed to providing you with the best care.
          </p>
        </div>

        {/* Primary Care Doctors */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Primary Care & Specialties</h3>
          <div className="grid grid-cols-1 gap-8">
            {doctors.map((doctor, index) => (
              <DoctorCard 
                key={index}
                doctor={doctor} 
              />
            ))}
          </div>
        </div>

        {/* ENT Specialists */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Our ENT Specialists</h3>
          <div className="grid grid-cols-1 gap-8">
            {entDoctors.map((doctor, index) => (
              <EntDoctorCard 
                key={`ent-${index}`}
                doctor={doctor}
              />
            ))}
          </div>
        </div>

        {/* Why Choose Doctor Uncle for ENT Care */}
        <EntCareBenefits />
      </div>
    </div>
  );
};

export default DoctorProfiles;
