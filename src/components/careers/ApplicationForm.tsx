
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobCategory } from "./JobListingSection";

interface ApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
  jobCategories: JobCategory[];
}

const ApplicationForm = ({ 
  selectedCategory, 
  selectedPosition, 
  jobCategories 
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !selectedPosition) {
      toast.error("Please select a job category and position");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.experience || !resumeFile) {
      toast.error("Please fill all required fields and upload your resume");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // In a real implementation, we would upload the resume to storage
      // and save the application data to a database
      
      toast.success("Your application has been submitted successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        resumeUrl: "",
      });
      setResumeFile(null);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPosition) return null;

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h4 className="text-lg font-medium mb-4">
        Apply for: {selectedCategoryData?.positions.find(p => p.id === selectedPosition)?.title}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 9876543210"
              required
            />
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience *
            </label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="5"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Resume (PDF) *
          </label>
          <Input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="cursor-pointer"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
