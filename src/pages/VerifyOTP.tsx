
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import OTPInput from "@/components/OTPInput";
import VerificationSuccess from "@/components/VerificationSuccess";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";

  useEffect(() => {
    if (!phone) {
      toast.error("Phone number is required for verification");
      navigate("/login");
    }
  }, [phone, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phone, otp);
      setVerified(true);
      setTimeout(() => {
        navigate("/patient-portal");
      }, 2000);
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    // Implement resend OTP functionality here
    toast.info("OTP resent to your phone number.");
  };

  if (verified) {
    return <VerificationSuccess />;
  }

  return (
    <>
      <Helmet>
        <title>Verify OTP | Doctor Uncle Family Clinic</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify your phone number
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a code to {phone}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="font-medium text-primary hover:text-primary/80"
                  disabled={loading}
                >
                  Resend Code
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verify;
