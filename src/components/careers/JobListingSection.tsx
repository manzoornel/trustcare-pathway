
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type JobPosition = {
  id: string;
  title: string;
};

export type JobCategory = {
  id: string;
  title: string;
  positions: JobPosition[];
  description: string;
  requirements: string;
};

interface JobListingSectionProps {
  jobCategories: JobCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
}

const JobListingSection = ({
  jobCategories,
  selectedCategory,
  setSelectedCategory,
  selectedPosition,
  setSelectedPosition,
}: JobListingSectionProps) => {
  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);

  return (
    <div id="job-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Current Opportunities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {jobCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.id 
                ? "border-primary border-2 shadow-md" 
                : "hover:shadow-md"
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedPosition("");
            }}
          >
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Requirements:</strong> {category.requirements}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <h3 className="text-xl font-semibold mb-4">Available Positions in {selectedCategoryData?.title}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {selectedCategoryData?.positions.map((position) => (
              <div
                key={position.id}
                className={`p-4 border rounded-md cursor-pointer ${
                  selectedPosition === position.id
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setSelectedPosition(position.id)}
              >
                {position.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingSection;
