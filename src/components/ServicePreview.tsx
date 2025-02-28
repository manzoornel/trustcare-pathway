
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicePreview = () => {
  const services = [
    {
      title: "General Medicine",
      description: "Expert consultation for fever, infections, and chronic diseases.",
    },
    {
      title: "Diabetes Management",
      description: "Advanced diabetes care with diet plans & continuous monitoring.",
    },
    {
      title: "Minor Surgeries",
      description: "Safe and efficient minor surgical procedures with expert care.",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Healthcare Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a wide range of medical services tailored to meet your family's health needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicePreview;
