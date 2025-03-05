
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
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hospitalId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verify if hospital ID and phone number are in the correct format
    if (!/^H\d{5}$/.test(formData.hospitalId)) {
      toast.error("Hospital ID must be in format H12345");
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      setIsLoading(false);
      return;
    }
    
    // Verify passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    // Verify password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      // Check if hospital ID or phone already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('patient_profiles')
        .select('hospital_id, phone')
        .or(`hospital_id.eq.${formData.hospitalId},phone.eq.${formData.phone}`)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingProfile) {
        if (existingProfile.hospital_id === formData.hospitalId) {
          toast.error("An account with this Hospital ID already exists");
        } else {
          toast.error("An account with this phone number already exists");
        }
        setIsLoading(false);
        return;
      }
      
      // Sign up the user
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        hospitalId: formData.hospitalId,
      });
      
      navigate("/verify-otp");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
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
                  Enter your details to create a new patient account
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
                      placeholder="Enter your 10-digit phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">Must be a 10-digit number</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="hospitalId" className="text-sm font-medium">Hospital ID</label>
                    <Input
                      id="hospitalId"
                      name="hospitalId"
                      placeholder="Enter your hospital ID (e.g., H12345)"
                      value={formData.hospitalId}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">Format: H followed by 5 digits (e.g., H12345)</p>
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
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
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
