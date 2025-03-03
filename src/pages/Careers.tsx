
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const jobCategories = [
  {
    id: "doctor",
    title: "Doctors",
    positions: [
      { id: "general-physician", title: "General Physician" },
      { id: "pediatrician", title: "Pediatrician" },
      { id: "cardiologist", title: "Cardiologist" },
      { id: "gynecologist", title: "Gynecologist" },
      { id: "neurologist", title: "Neurologist" },
      { id: "pulmonologist", title: "Pulmonologist" },
      { id: "ent-specialist", title: "ENT Specialist" },
      { id: "surgeon", title: "Surgeon" },
      { id: "ophthalmologist", title: "Ophthalmologist" },
      { id: "dermatologist", title: "Dermatologist" },
      { id: "radiologist", title: "Radiologist" },
      { id: "orthopedician", title: "Orthopedician" },
      { id: "rmo", title: "Resident Medical Officer (RMO)" },
    ],
    description:
      "Join our team of medical professionals dedicated to providing exceptional patient care.",
    requirements: "MBBS/MD with relevant specialization and valid medical license.",
  },
  {
    id: "nurse",
    title: "Nursing Staff",
    positions: [
      { id: "head-nurse", title: "Head Nurse" },
      { id: "staff-nurse", title: "Staff Nurse" },
      { id: "nursing-assistant", title: "Nursing Assistant" },
    ],
    description:
      "Be part of our nursing team that provides compassionate and quality care to our patients.",
    requirements: "Nursing degree/diploma with relevant experience and registration.",
  },
  {
    id: "admin",
    title: "Administrative Staff",
    positions: [
      { id: "receptionist", title: "Receptionist" },
      { id: "office-manager", title: "Office Manager" },
      { id: "medical-records", title: "Medical Records Officer" },
    ],
    description:
      "Help us maintain efficient clinic operations and provide excellent service to our patients.",
    requirements: "High school diploma or equivalent, computer proficiency, and customer service skills.",
  },
  {
    id: "tech",
    title: "Technical Staff",
    positions: [
      { id: "lab-technician", title: "Laboratory Technician" },
      { id: "radiographer", title: "Radiographer" },
      { id: "pharmacist", title: "Pharmacist" },
    ],
    description:
      "Support our clinical services with your technical expertise and ensure accurate diagnostics.",
    requirements: "Relevant technical degree/diploma and certification in the respective field.",
  },
];

const Careers = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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
      setSelectedCategory("");
      setSelectedPosition("");
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        {/* Hero Section */}
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

        {/* Why Join Us Section */}
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

        {/* Job Listings Section */}
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
              
              {selectedPosition && (
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
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
