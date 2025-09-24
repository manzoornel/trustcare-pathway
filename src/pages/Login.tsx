import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import LoginTabs from "@/components/login/LoginTabs";
import { instance } from "../axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { auth, login, loginWithOTP } = useAuth();

  const [activeTab, setActiveTab] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if already authenticated
    const token = localStorage.getItem("token");

    if (token) {
      toast.success("User is already logged in");

      navigate("/patient-portal");
    }
  }, [auth.isAuthenticated, navigate]);

  // Handle Email/Password login
  const handleEmailLogin = async ({ email }: { email: string }) => {
    setLoading(true);
    setError(null);

    try {
      await loginWithOTP(email);

      const responsefirst = await instance.post(
        `getPatientsByEmail?email=${email}`,
        {} // empty body
      );

      console.log(responsefirst.data.code);

      if (responsefirst?.data?.code === 1) {
        if (responsefirst?.data?.data?.length === 0) {
          toast.error("No patients are there with this email");
          navigate("/login");
          setLoading(false);
          return;
        }
      } else if (responsefirst?.data?.code === 0) {
        setError("No patients are there with this email");
        toast.error("No patients are there with this email");
        navigate("/login");
        setLoading(false);

        return;
      }

      const response = await instance.post(
        `sendOtpEmail?patient_id=${responsefirst?.data?.data[0]?.patient_id}&email=${email}`,
        {} // empty body
      );

      if (response.data.code === 1) {
        console.log(response);

        toast.success(`OTP sent successfully to:${email}`);
        auth.email = email;
        auth.patient_id = responsefirst?.data?.data[0]?.patient_id;
        navigate("/verify-otp", {
          state: {
            email: email,
            patient_id: responsefirst?.data?.data[0]?.patient_id,
          },
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("OTP request failed:", error);
      setLoading(false);
    }
  };

  // Handle Phone login
  const handlePhoneLogin = async ({ phone }: { phone: string }) => {
    setLoading(true);
    setError(null);

    try {
      await loginWithOTP(phone);

      const responsefirst = await instance.post(
        `getPatientsByMobile?mobile=${phone}`,
        {} // empty body
      );

      console.log(responsefirst.data);

      if (responsefirst?.data?.code === 1) {
        if (responsefirst?.data?.data?.length === 0) {
          toast.error("No patients are there with this number");
          navigate("/login");
          setLoading(false);
          return;
        }
      } else if (responsefirst?.data?.code === 0) {
        setError("No patients are there with this number");

        navigate("/login");
        setLoading(false);

        return;
      }

      const response = await instance.post(
        `getLoginOTP?patient_id=${responsefirst?.data?.data[0]?.patient_id}`,
        {} // empty body
      );

      if (response.data.code === 1) {
        console.log(response);

        toast.success(`OTP sent successfully to:${phone}`);
        auth.phone = phone;
        auth.patient_id = responsefirst?.data?.data[0]?.patient_id;
        navigate("/verify-otp", {
          state: {
            phone: phone,
            patient_id: responsefirst?.data?.data[0]?.patient_id,
          },
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("OTP request failed:", error);
      setLoading(false);
    }
  };

  // Quick login with demo account
  const loginWithDemoAccount = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
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
                <CardTitle className="text-2xl font-bold">
                  Patient Login
                </CardTitle>
                <CardDescription>
                  Access your health records and appointments
                </CardDescription>

                <CardDescription>
                  If you are a patient of doctor uncle login with your number
                </CardDescription>
              </CardHeader>

              <CardContent>
                <LoginTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleEmailLogin={handleEmailLogin}
                  handlePhoneLogin={handlePhoneLogin}
                  loginWithDemoAccount={loginWithDemoAccount}
                  seterror={setError}
                  error={error}
                  loading={loading}
                />
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
