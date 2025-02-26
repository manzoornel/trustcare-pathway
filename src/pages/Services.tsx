
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";

const Services = () => {
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
    {
      title: "Laboratory Services",
      description: "Blood tests, urine analysis, ECG, and more.",
    },
    {
      title: "Pharmacy & Medications",
      description: "On-site pharmacy for easy access to prescribed medicines.",
    },
    {
      title: "Home Care & Telemedicine",
      description: "Online consultations and home visits for elderly and disabled patients.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare Services at Doctor Uncle Family Clinic – Expert Care for Your Family</title>
        <meta
          name="description"
          content="Explore our wide range of medical services, including diabetes management, lab tests, minor surgeries, pharmacy, and home care."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Comprehensive Healthcare Services for You</h1>
            <p className="text-lg text-gray-600 mb-12">
              At Doctor Uncle Family Clinic, we offer a range of specialized healthcare services 
              tailored to meet your family's needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
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

            <div className="mt-12 text-center">
              <a
                href="/appointments"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Book an appointment today!
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
