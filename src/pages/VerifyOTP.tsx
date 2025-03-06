
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import OTPInput from "@/components/OTPInput";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { auth, verifyUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    // If not in signup process, redirect to signup
    if (!auth.hospitalId || auth.isVerified) {
      navigate("/signup");
      return;
    }

    // Countdown timer for OTP resend
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auth, navigate]);

  const handleResendOTP = () => {
    setResendDisabled(true);
    setTimeLeft(60);
    toast.info("New OTP sent to your phone and email");
    
    // Start the countdown again
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleOtpComplete = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would validate the OTP against a backend service
    setTimeout(() => {
      // For demo, we'll consider "123456" as the valid OTP
      if (otp === "123456") {
        toast.success("OTP verified successfully");
        verifyUser();
        navigate("/create-profile");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Verify your identity with OTP at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Verify OTP</h1>
            <p className="text-gray-600 mb-8 text-center">
              Please enter the verification code sent to your phone and email
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>OTP Verification</CardTitle>
                <CardDescription>
                  Enter the 6-digit code to verify your identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
                    <div className="flex justify-center">
                      <OTPInput
                        onComplete={handleOtpComplete}
                        length={6}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      An OTP has been sent to your phone ({auth.phone?.slice(-4)}) and email
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{" "}
                      <Button 
                        variant="link" 
                        className="p-0" 
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                      >
                        Resend
                        {resendDisabled && ` (${timeLeft}s)`}
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

export default VerifyOTP;
