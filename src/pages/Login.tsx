
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    hospitalId: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would validate against a backend
    setTimeout(() => {
      // Simulate authentication check
      if (formData.hospitalId.trim() !== "") {
        toast.success("Authentication successful");
        // Store auth state
        localStorage.setItem("patientAuth", JSON.stringify({
          isAuthenticated: true,
          needsProfile: true,
          name: formData.name,
          phone: formData.phone,
          hospitalId: formData.hospitalId
        }));
        navigate("/create-profile");
      } else {
        toast.error("Invalid hospital ID");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Patient Login | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Log in to access your patient portal at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Patient Login</h1>
            <p className="text-gray-600 mb-8 text-center">
              Enter your credentials to access your medical records
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Authentication</CardTitle>
                <CardDescription>
                  Please enter your details to verify your identity
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
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Login"}
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

export default Login;
