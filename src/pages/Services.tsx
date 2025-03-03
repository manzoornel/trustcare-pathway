
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";

const Services = () => {
  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive healthcare for patients of all ages, including routine check-ups, preventive care, and treatment for acute and chronic conditions.",
    },
    {
      title: "Specialized Diabetes Care",
      description: "Expert management of diabetes with personalized treatment plans, continuous glucose monitoring, and nutritional counseling.",
    },
    {
      title: "Women's Health",
      description: "Comprehensive women's health services including preventive screenings, prenatal care, and management of women's health concerns.",
    },
    {
      title: "Diagnostic Services",
      description: "State-of-the-art laboratory testing, ECG, ultrasound, and other diagnostic procedures to ensure accurate diagnosis.",
    },
    {
      title: "Pharmacy Services",
      description: "Convenient on-site pharmacy providing prescription medications, over-the-counter products, and medication counseling.",
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations with our healthcare providers for those unable to visit in person or requiring follow-up care.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare Services at Doctor Uncle Family Clinic – Expert Care for Your Family</title>
        <meta
          name="description"
          content="Explore our wide range of medical services, including primary care, diabetes management, women's health, diagnostic services, and telemedicine."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Our Healthcare Services</h1>
            <p className="text-lg text-gray-600 mb-12">
              At Doctor Uncle Family Clinic, we offer a comprehensive range of medical services 
              designed to meet the diverse healthcare needs of your entire family.
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
        <Footer />
      </div>
    </>
  );
};

export default Services;
