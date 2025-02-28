
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="py-16 bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Book Your Appointment?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Schedule your visit today and take the first step towards better health. 
              Our team is ready to provide you with exceptional care.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/appointments" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
