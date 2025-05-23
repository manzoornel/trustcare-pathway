
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BenefitsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Why Join Doctor Uncle Family Clinic?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Professional Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We invest in continuous education and professional development for all our staff, helping you advance your career.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Collaborative Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Work in a supportive team where your ideas are valued and collaboration is encouraged to provide the best patient care.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Competitive Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Enjoy competitive salaries, health insurance, retirement plans, and other benefits that recognize your contribution.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BenefitsSection;
