
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import OTPInput from "@/components/OTPInput";
import VerificationSuccess from "@/components/VerificationSuccess";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { verifyOTP, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Demo OTP for testing (in a real app, this would be sent via SMS)
  const [demoOtp] = useState("123456");
  
  // Get phone from location state or from auth context
  const phone = location.state?.phone || auth.phone || "";

  useEffect(() => {
    if (!phone) {
      console.log("No phone number found for verification");
      toast.error("Phone number is required for verification");
      navigate("/login");
    } else {
      console.log("Phone number for verification:", phone);
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
      // For demo purposes, allow the demo OTP or any 6-digit OTP to work
      if (otp === demoOtp || process.env.NODE_ENV === 'development') {
        // Set authenticated state directly without going through Supabase
        // This bypasses the token expiration issue
        setVerified(true);
        toast.success("Phone number verified successfully!");
        
        // Update the auth context to mark the user as verified
        await verifyOTP(phone, otp);
        
        setTimeout(() => {
          navigate("/patient-portal");
        }, 2000);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoOtp = () => {
    setOtp(demoOtp);
  };

  const handleResendOTP = () => {
    // In a real app, this would trigger a new OTP to be sent
    toast.info(`Demo OTP resent: ${demoOtp}`);
  };

  if (verified) {
    return (
      <VerificationSuccess 
        phone={phone} 
        redirectUrl="/patient-portal" 
        redirectLabel="Go to Patient Portal" 
      />
    );
  }

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
  };

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
          
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              This is a demo version. Use code <span className="font-bold">{demoOtp}</span> for testing purposes or click "Use Demo OTP".
            </AlertDescription>
          </Alert>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <OTPInput
                length={6}
                onComplete={handleOtpChange}
                value={otp}
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
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleUseDemoOtp}
                  className="font-medium text-primary hover:text-primary/80"
                  disabled={loading}
                >
                  Use Demo OTP
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
