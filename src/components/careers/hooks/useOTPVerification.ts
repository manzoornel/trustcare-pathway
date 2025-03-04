
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
      toast.success(`Verification code sent to ${phone} and ${email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    otpSent,
    otpVerified,
    isSubmitting,
    setOtpSent,
    setOtpVerified,
    handleSendOTP
  };
};
