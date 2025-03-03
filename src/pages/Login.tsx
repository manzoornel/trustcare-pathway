import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

const authenticatedUsers = [
  { hospitalId: "H12345", phone: "1234567890", email: "patient1@example.com", name: "John Doe", password: "password123" },
  { hospitalId: "H67890", phone: "9876543210", email: "patient2@example.com", name: "Jane Smith", password: "password456" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  
  const [passwordFormData, setPasswordFormData] = useState({
    identifier: "",
    password: ""
  });
  
  const [otpFormData, setOtpFormData] = useState({
    identifier: ""
  });
  
  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOtpFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = authenticatedUsers.find(
      u => u.hospitalId === passwordFormData.identifier ||
           u.phone === passwordFormData.identifier ||
           u.email === passwordFormData.identifier
    );
    
    setTimeout(() => {
      if (user && user.password === passwordFormData.password) {
        toast.success("Login successful");
        login({
          isAuthenticated: true,
          name: user.name,
          phone: user.phone,
          hospitalId: user.hospitalId,
          email: user.email,
          profileComplete: true
        });
        navigate("/patient-portal");
      } else {
        toast.error("Invalid credentials");
      }
      setIsLoading(false);
    }, 1500);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = authenticatedUsers.find(
      u => u.hospitalId === otpFormData.identifier ||
           u.phone === otpFormData.identifier ||
           u.email === otpFormData.identifier
    );
    
    setTimeout(() => {
      if (user) {
        toast.success("OTP sent to your phone and email");
        localStorage.setItem("patientAuth", JSON.stringify({
          isAuthenticated: false,
          isVerified: false,
          name: user.name,
          phone: user.phone,
          hospitalId: user.hospitalId,
          email: user.email
        }));
        navigate("/verify-otp");
      } else {
        toast.error("User not found");
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
              Access your medical records securely
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Authentication</CardTitle>
                <CardDescription>
                  Log in with your hospital ID, phone number, or email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="password" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="otp">OTP</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="password">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="identifier" className="text-sm font-medium">Hospital ID / Phone / Email</label>
                        <Input
                          id="identifier"
                          name="identifier"
                          placeholder="Enter your Hospital ID, Phone, or Email"
                          value={passwordFormData.identifier}
                          onChange={handlePasswordFormChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          value={passwordFormData.password}
                          onChange={handlePasswordFormChange}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="otp">
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="otpIdentifier" className="text-sm font-medium">Hospital ID / Phone / Email</label>
                        <Input
                          id="otpIdentifier"
                          name="identifier"
                          placeholder="Enter your Hospital ID, Phone, or Email"
                          value={otpFormData.identifier}
                          onChange={handleOtpFormChange}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
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
