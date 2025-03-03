
import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="bg-secondary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Join Our Healthcare Team</h1>
          <p className="text-lg mb-8">
            Be part of Doctor Uncle Family Clinic where we value excellence, compassion, and
            continuous learning. Explore our current opportunities and grow with us.
          </p>
          <Button
            className="bg-white text-secondary hover:bg-gray-100"
            onClick={() => document.getElementById("job-listings")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Open Positions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
