
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Simulate database of existing patients
const existingPatients = [
  { hospitalId: "H12345", phone: "1234567890", email: "" },
  { hospitalId: "H67890", phone: "9876543210", email: "" },
];

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hospitalId: "",
    email: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verify against existing patient records
    const matchingPatient = existingPatients.find(
      patient => patient.hospitalId === formData.hospitalId && patient.phone === formData.phone
    );
    
    setTimeout(() => {
      if (matchingPatient) {
        // Store signup data
        signUp({
          name: formData.name,
          phone: formData.phone,
          hospitalId: formData.hospitalId,
          email: formData.email,
        });
        toast.success("Information verified! Sending OTP for verification.");
        navigate("/verify-otp");
      } else {
        toast.error("Hospital ID or phone number doesn't match our records.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Patient Sign Up | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Sign up to create your patient account at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Patient Sign Up</h1>
            <p className="text-gray-600 mb-8 text-center">
              Create your patient account to access your medical records
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Enter your details to verify your identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">Must match the number you provided at the hospital</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="hospitalId" className="text-sm font-medium">Hospital ID</label>
                    <Input
                      id="hospitalId"
                      name="hospitalId"
                      placeholder="Enter your hospital ID"
                      value={formData.hospitalId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
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
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Sign Up"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                        Login
                      </Button>
                    </p>
                  </div>
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

export default SignUp;
