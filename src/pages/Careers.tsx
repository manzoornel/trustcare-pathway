
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/careers/HeroSection";
import BenefitsSection from "@/components/careers/BenefitsSection";
import JobListingSection from "@/components/careers/JobListingSection";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { jobCategories } from "@/components/careers/CareersData";

const Careers = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Why Join Us Section */}
        <BenefitsSection />

        {/* Job Listings Section */}
        <JobListingSection 
          jobCategories={jobCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />

        {/* Application Form - displayed when a position is selected */}
        {selectedCategory && selectedPosition && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <ApplicationForm 
              selectedCategory={selectedCategory} 
              selectedPosition={selectedPosition}
              jobCategories={jobCategories}
            />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
