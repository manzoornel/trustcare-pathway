
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomeCareServices = () => {
  const services = [
    {
      icon: "🩺",
      title: "Doctor Home Visit",
      description: "Expert medical consultation in the comfort of your home."
    },
    {
      icon: "🩹",
      title: "Nursing Care",
      description: "Professional wound dressing, medication administration & post-surgical care."
    },
    {
      icon: "💉",
      title: "Injections & Infusions",
      description: "Safe administration of injections, IV fluids & medication at home."
    },
    {
      icon: "⚕️",
      title: "Physiotherapy",
      description: "Rehabilitation services & pain management in your home environment."
    },
    {
      icon: "📊",
      title: "ECG & Cardiac Monitoring",
      description: "Heart health testing and monitoring for patients with cardiac conditions."
    },
    {
      icon: "🧪",
      title: "Laboratory Tests",
      description: "Sample collection at home for various diagnostic tests with quick results."
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Home Care Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Quality healthcare at your doorstep. We bring expert medical care to your home,
            ensuring comfort, convenience, and professional treatment.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted Home Healthcare Services</h3>
            <p className="text-gray-600 mb-6">
              Our Home Care Services are designed for individuals who require medical support, 
              nursing care, physiotherapy, and diagnostic services in the comfort of their homes.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">✅</span>
                <span>24/7 Professional Home Healthcare Services</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">✅</span>
                <span>Experienced Doctors & Skilled Nursing Team</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">✅</span>
                <span>Safe & Hygienic Medical Care at Home</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyan-500 mr-2">✅</span>
                <span>Convenient & Affordable Healthcare Solutions</span>
              </div>
            </div>
            
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <a href="/contact">Book Home Care Service</a>
            </Button>
          </div>
          
          <div className="w-full md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
            <img 
              src="/lovable-uploads/84716f55-3da5-45a6-bb8f-5c84e1a8b6fa.png" 
              alt="Doctor Uncle Home Care Services" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-cyan-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Who Can Benefit from Our Home Healthcare Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-cyan-500 mr-2">🏡</span>
              <span><strong>Elderly & Bedridden Patients</strong> – Special care for senior citizens with mobility issues.</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-500 mr-2">🏥</span>
              <span><strong>Post-Surgery Patients</strong> – Recovery support with professional nursing and physiotherapy.</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-500 mr-2">🤕</span>
              <span><strong>Patients with Chronic Illnesses</strong> – Diabetes, heart disease, respiratory conditions, and more.</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-500 mr-2">👩‍⚕️</span>
              <span><strong>Palliative & End-of-Life Care</strong> – Comfort and pain management for critical patients.</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-lg mb-4">
            <strong>Serving:</strong> Vakkad, Unniyal, Tanur, and surrounding areas
          </p>
          <p className="text-lg">
            <strong>Call for home care appointments:</strong> 
            <a href="tel:9961588880" className="text-cyan-600 hover:underline ml-2">9961 588 880</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeCareServices;
