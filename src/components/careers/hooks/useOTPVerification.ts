
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSent(true);
      setTimeLeft(60);
      setResendDisabled(true);
      toast.success(`Verification code sent to ${phone} and ${email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
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
      
      // Simulate OTP verification API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll consider "123456" as the valid OTP
      if (otp === "123456") {
        setOtpVerified(true);
        toast.success("Phone and email verified successfully");
        return true;
      } else {
        toast.error("Invalid verification code. Please try again.");
        return false;
      }
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify code. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setTimeLeft(60);
    
    // Simulate API call
    setTimeout(() => {
      toast.info("New verification code sent to your phone and email");
    }, 500);
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

  return {
    otp,
    setOtp,
    otpSent,
    otpVerified,
    isSubmitting,
    timeLeft,
    resendDisabled,
    setOtpSent,
    setOtpVerified,
    setTimeLeft,
    setResendDisabled,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    decrementTimeLeft
  };
};
