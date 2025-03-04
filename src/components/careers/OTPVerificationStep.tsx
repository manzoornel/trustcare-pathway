
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import OTPInput from "@/components/OTPInput";
import { useOTPVerification } from "./hooks/useOTPVerification";
import { Loader2 } from "lucide-react";

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
  const {
    otp,
    setOtp,
    isSubmitting,
    verificationError,
    timeLeft,
    resendDisabled,
    isResending,
    setTimeLeft,
    setResendDisabled,
    handleVerifyOTP,
    handleResendOTP,
    decrementTimeLeft,
    clearVerificationError
  } = useOTPVerification({ email, phone });

  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [decrementTimeLeft]);

  const handleVerify = async () => {
    const verified = await handleVerifyOTP();
    if (verified) {
      onVerificationComplete();
    }
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
          disabled={isSubmitting}
        />
        {otp.length !== 6 && otp.length > 0 && (
          <p className="text-sm text-red-500 text-center mt-2">
            Please enter the complete 6-digit verification code
          </p>
        )}
        {verificationError && (
          <p className="text-sm text-red-500 text-center mt-2">
            {verificationError}
          </p>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto" 
          onClick={handleResendOTP}
          disabled={resendDisabled || isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Resending...
            </>
          ) : (
            <>
              Resend Code
              {resendDisabled && ` (${timeLeft}s)`}
            </>
          )}
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBackToContact}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="button" 
            onClick={handleVerify}
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
