
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import LoginTabs from "@/components/login/LoginTabs";

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
  const loginWithDemoAccount = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      setEmail(email);
      setPassword(password);
      await login(email, password);
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
                <LoginTabs 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  phone={phone}
                  setPhone={setPhone}
                  handleEmailLogin={handleEmailLogin}
                  handlePhoneLogin={handlePhoneLogin}
                  loginWithDemoAccount={loginWithDemoAccount}
                  error={error}
                  loading={loading}
                />
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
