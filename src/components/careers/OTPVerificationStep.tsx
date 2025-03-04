
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OTPInput from "@/components/OTPInput";

interface OTPVerificationStepProps {
  email: string;
  phone: string;
  onVerificationComplete: () => void;
  onBackToContact: () => void;
}

const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({
  email,
  phone,
  onVerificationComplete,
  onBackToContact,
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }
    
    try {
      setIsVerifying(true);
      
      // Simulate OTP verification API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll consider "123456" as the valid OTP
      if (otp === "123456") {
        onVerificationComplete();
        toast.success("Phone and email verified successfully");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setTimeLeft(60);
    toast.info("New verification code sent to your phone and email");
    
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

  return (
    <div className="rounded-lg bg-gray-50 p-4 mb-4">
      <h3 className="text-md font-medium mb-2">Verify Your Contact</h3>
      <p className="text-sm text-gray-600 mb-4">
        A verification code has been sent to your phone ({phone}) and email ({email}).
      </p>
      
      <div className="mb-4">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Verification Code *
        </label>
        <OTPInput
          onComplete={(value) => setOtp(value)}
          length={6}
        />
        {otp.length !== 6 && otp.length > 0 && (
          <p className="text-sm text-red-500 text-center mt-2">
            Please enter the complete 6-digit verification code
          </p>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto" 
          onClick={handleResendOTP}
          disabled={resendDisabled}
        >
          Resend Code
          {resendDisabled && ` (${timeLeft}s)`}
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBackToContact}
          >
            Back
          </Button>
          <Button 
            type="button" 
            onClick={handleVerifyOTP}
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
