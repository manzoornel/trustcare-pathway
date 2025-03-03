
import { CheckCircle, MapPin, Phone } from 'lucide-react';

const EntCareBenefits = () => {
  return (
    <div className="mt-12 bg-white p-8 rounded-xl shadow-md animate-fade-up">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Doctor Uncle Family Clinic for ENT Care?</h3>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">Experienced ENT Specialists & Surgeons – Comprehensive diagnosis and treatment</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">Advanced ENT Procedures & Surgeries – Using the latest medical technology</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">Patient-Centered Approach – Personalized care for both children and adults</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">State-of-the-Art Facilities – Equipped with modern ENT diagnostic tools</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">Convenient Appointments – Easy scheduling and minimal wait times</span>
        </li>
      </ul>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center flex-wrap gap-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">Vakkad Branch (Near Aneesha Theatre)</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-primary mr-2" />
            <span>9961 588 880 | 04942 087 888</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntCareBenefits;
