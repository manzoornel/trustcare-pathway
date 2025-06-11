import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import OTPInput from "@/components/OTPInput";
import { Button } from "@/components/ui/button";
import { instance } from "../axios";
import { useAuth } from "@/contexts/AuthContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const phone =
    location.state?.phone || auth.phone || localStorage.getItem("phone") || "";

  const email =
    location.state?.email || auth.email || localStorage.getItem("email") || "";

  const patient_id =
    location.state?.patient_id ||
    auth.patient_id ||
    localStorage.getItem("patient_id") ||
    "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      toast.success("User is already logged in");
      navigate("/patient-portal");
    }

    if (!phone && !email) {
      toast.error("Phone number or email is required ");
      navigate("/login");
    }
  }, [patient_id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (phone) {
        response = await instance.post(
          `patientLogin?mobile=${phone}&otp=${otp}`
        );
      } else {
        response = await instance.post(
          `verifyOtpEmail?email=${email}&otp=${otp}&patient_id=${patient_id}`
        );
      }

      if (response.data.code === 1) {
        localStorage.setItem("token", response?.data?.data.token);
        localStorage.setItem(
          "patient_name",
          response?.data?.data?.patient_name
        );
        localStorage.setItem("uhid", response?.data?.data.uhid);
        localStorage.setItem("address", response?.data?.address);
        localStorage.setItem("phone", response?.data?.data.phone);
        localStorage.setItem("email", response?.data?.data?.email);
        localStorage.setItem(
          "is_email_verified",
          response?.data?.data?.is_email_verified
        );

        localStorage.setItem("patient_id", response?.data?.data?.patient_id);
        auth.name = response?.data?.data?.patient_name;
        auth.email = response?.data?.data?.email;

        toast.success("Phone number verified successfully!");

        navigate("/patient-portal", { replace: true });
      } else {
        toast.error("Invalid otp");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP | Doctor Uncle Family Clinic</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">
            Verify your phone number
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            We've sent a 6-digit OTP to {phone || email}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <OTPInput length={6} onComplete={setOtp} value={otp} />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verify;
