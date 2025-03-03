
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    address: "",
    dateOfBirth: ""
  });

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("patientAuth");
    if (!auth) {
      navigate("/login");
      return;
    }

    const parsedAuth = JSON.parse(auth);
    if (!parsedAuth.isAuthenticated || !parsedAuth.needsProfile) {
      navigate("/patient-portal");
      return;
    }

    setAuthData(parsedAuth);
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email match
    if (formData.email !== formData.confirmEmail) {
      toast.error("Emails do not match");
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would send data to a backend
    setTimeout(() => {
      // Store the complete profile data
      const updatedAuth = {
        ...authData,
        needsProfile: false,
        email: formData.email,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        profileComplete: true
      };
      
      localStorage.setItem("patientAuth", JSON.stringify(updatedAuth));
      localStorage.setItem("patientProfile", JSON.stringify({
        ...updatedAuth,
        ...formData
      }));
      
      toast.success("Profile created successfully");
      navigate("/patient-portal");
      setIsLoading(false);
    }, 1500);
  };

  if (!authData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Create Profile | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Complete your patient profile at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Create Your Profile</h1>
            <p className="text-gray-600 mb-8 text-center">
              Welcome {authData.name}, please complete your profile
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Add your email and additional details to complete your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmEmail" className="text-sm font-medium">Confirm Email</label>
                    <Input
                      id="confirmEmail"
                      name="confirmEmail"
                      type="email"
                      placeholder="Confirm your email address"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Profile..." : "Complete Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default CreateProfile;
