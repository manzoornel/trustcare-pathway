
import { useState } from "react";
import { toast } from "sonner";

interface UseOTPVerificationProps {
  email: string;
  phone: string;
}

export const useOTPVerification = ({ email, phone }: UseOTPVerificationProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otp, setOtp] = useState("");

  const handleSendOTP = async () => {
    if (!email || !phone) {
      toast.error("Please provide valid email and phone number");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setVerificationError(null);
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 5% chance of simulated error for testing
          if (Math.random() < 0.05) {
            reject(new Error("Failed to send verification code"));
          } else {
            resolve(true);
          }
        }, 1000);
      });
      
      setOtpSent(true);
      setTimeLeft(60);
      setResendDisabled(true);
      toast.success(`Verification code sent to ${phone} and ${email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send verification code";
      setVerificationError(errorMessage);
      toast.error(`${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setVerificationError(null);
      
      // Simulate OTP verification API call with a delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // For demo, we'll consider "123456" as the valid OTP
          if (otp === "123456") {
            resolve(true);
          } else {
            reject(new Error("Invalid verification code"));
          }
        }, 1000);
      });
      
      setOtpVerified(true);
      toast.success("Phone and email verified successfully");
      return true;
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to verify code";
      setVerificationError(errorMessage);
      toast.error(`${errorMessage}. Please try again.`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setIsResending(true);
    setVerificationError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 5% chance of simulated error for testing
          if (Math.random() < 0.05) {
            reject(new Error("Failed to resend verification code"));
          } else {
            resolve(true);
          }
        }, 1000);
      });
      
      setTimeLeft(60);
      toast.success("New verification code sent to your phone and email");
      
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to resend verification code";
      setVerificationError(errorMessage);
      toast.error(`${errorMessage}. Please try again later.`);
      setResendDisabled(false); // Allow retry if failed
    } finally {
      setIsResending(false);
    }
  };

  const decrementTimeLeft = () => {
    setTimeLeft(prevTime => {
      if (prevTime <= 1) {
        setResendDisabled(false);
        return 0;
      }
      return prevTime - 1;
    });
  };

  const clearVerificationError = () => {
    setVerificationError(null);
  };

  return {
    otp,
    setOtp,
    otpSent,
    otpVerified,
    isSubmitting,
    isResending,
    verificationError,
    timeLeft,
    resendDisabled,
    setOtpSent,
    setOtpVerified,
    setTimeLeft,
    setResendDisabled,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    decrementTimeLeft,
    clearVerificationError
  };
};
