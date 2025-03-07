
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Info } from "lucide-react";

// Demo patients that can be used for quick login
const demoPatients = [
  {
    name: "John Smith",
    hospitalId: "H12345",
    email: "john.smith@example.com",
    password: "password123",
    phone: "1234567890"
  },
  {
    name: "Sarah Johnson",
    hospitalId: "H67890",
    email: "sarah.johnson@example.com",
    password: "password123",
    phone: "9876543210"
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { auth, login, loginWithOTP } = useAuth();
  
  const [activeTab, setActiveTab] = useState("email");
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (auth.isAuthenticated) {
      navigate("/patient-portal");
    }
  }, [auth.isAuthenticated, navigate]);

  // Handle Email/Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate("/patient-portal");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await loginWithOTP(phone);
      navigate("/verify-otp", { state: { phone } });
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Quick login with demo account
  const loginWithDemoAccount = async (patient: typeof demoPatients[0]) => {
    setLoading(true);
    setError(null);
    try {
      setEmail(patient.email);
      setPassword(patient.password);
      await login(patient.email, patient.password);
      navigate("/patient-portal");
    } catch (err: any) {
      setError(err.message || "Failed to login with demo account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Log in to your patient account at Doctor Uncle Family Clinic to access your medical records and appointments."
        />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto">
            <Card className="w-full shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Patient Login</CardTitle>
                <CardDescription>
                  Access your health records and appointments
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <form onSubmit={handleEmailLogin}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Logging in..." : "Login"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="phone">
                    <form onSubmit={handlePhoneLogin}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="1234567890"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Enter your 10-digit phone number
                          </p>
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">For testing purposes:</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                      className="flex items-center gap-1"
                    >
                      <Info className="h-4 w-4" />
                      {showDemoAccounts ? "Hide Demo Accounts" : "Show Demo Accounts"}
                    </Button>
                  </div>
                  
                  {showDemoAccounts && (
                    <div className="mt-2 border rounded-md p-3 bg-gray-50">
                      <p className="text-sm font-medium mb-2">Quick Login with Demo Accounts:</p>
                      <div className="space-y-2">
                        {demoPatients.map((patient, index) => (
                          <div key={index} className="border rounded-md p-2 bg-white">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-xs text-gray-500">Hospital ID: {patient.hospitalId}</p>
                                <p className="text-xs text-gray-500">Email: {patient.email}</p>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => loginWithDemoAccount(patient)}
                                disabled={loading}
                              >
                                Login
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <div className="text-center text-sm">
                  <span className="text-gray-500">Don't have an account? </span>
                  <a href="/signup" className="text-primary font-medium hover:underline">
                    Register here
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Login;
