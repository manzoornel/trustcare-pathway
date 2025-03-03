
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState("email");
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Hospital ID login
  const handleHospitalIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll just check against the auth.ts sample data
      // In a real app, this would be an API call
      const demoUser = {
        isAuthenticated: true,
        isVerified: true,
        needsProfile: false,
        hospitalId,
        name: "Demo Patient",
        email: "demo@example.com",
        phone: "555-555-5555",
        rewardPoints: 140
      };
      
      // Simulate authentication delay
      setTimeout(() => {
        login(demoUser);
        toast.success("Login successful!");
        navigate("/patient-portal");
      }, 1000);
    } catch (err) {
      setError("Invalid hospital ID or password");
      toast.error("Login failed. Please check your credentials.");
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
      // For demo purposes, we'll just redirect to OTP verification
      // In a real app, this would send an OTP and then redirect
      setTimeout(() => {
        navigate("/verify", { state: { phone } });
        toast.info("OTP sent to your phone number");
      }, 1000);
    } catch (err) {
      setError("Failed to send OTP");
      toast.error("Failed to send OTP. Please try again.");
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
                    <TabsTrigger value="email">Hospital ID</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <form onSubmit={handleHospitalIdLogin}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="hospitalId">Hospital ID</Label>
                          <Input
                            id="hospitalId"
                            placeholder="H12345"
                            value={hospitalId}
                            onChange={(e) => setHospitalId(e.target.value)}
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
                            placeholder="(555) 555-5555"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
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
