
import { Ear, Stethoscope, Activity, CheckCircle } from 'lucide-react';
import { EntDoctorProfile } from './types';
import ClinicInfo from './ClinicInfo';

interface EntDoctorCardProps {
  doctor: EntDoctorProfile;
}

const EntDoctorCard = ({ doctor }: EntDoctorCardProps) => {
  return (
    <div 
      className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 animate-fade-up max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-64 h-64 rounded-full overflow-hidden mb-6 bg-gray-200 border-4 border-primary/10">
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-1">{doctor.name}</h3>
          <p className="text-primary font-medium text-center mb-2">{doctor.title}</p>
          <p className="text-gray-600 text-center mb-4">{doctor.specialty}</p>
          <div className="flex space-x-4 mt-2">
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Ear className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Stethoscope className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">About {doctor.name}</h4>
            <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3">Expertise & Specializations</h4>
            <ul className="space-y-2">
              {doctor.specializations.map((spec, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                  <span className="text-gray-700">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <ClinicInfo clinicInfo={doctor.clinicInfo} />
        </div>
      </div>
    </div>
  );
};

export default EntDoctorCard;
