
import React from 'react';

const CasualtyServiceBanner = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-red-50 to-white p-8 rounded-xl shadow-sm">
          <div className="w-48 h-48 flex-shrink-0 mx-auto md:mx-0">
            <img 
              src="/lovable-uploads/88954829-a127-4367-854f-7771675d8c03.png" 
              alt="24 Hours Casualty Everyday" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Emergency Care When You Need It</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl">
              Our casualty department is open 24 hours a day, 7 days a week, providing immediate care for medical emergencies. Our experienced medical team is always ready to assist you with prompt and professional attention.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Emergency Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasualtyServiceBanner;
