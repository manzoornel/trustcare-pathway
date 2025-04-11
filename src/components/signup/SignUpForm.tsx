
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpFormData, validateSignUpForm } from "@/utils/signupValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon, Loader2 } from "lucide-react";
import OTPInput from "@/components/OTPInput";

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<void>;
  isLoading: boolean;
}

type SignupStep = "userInfo" | "verification" | "password";

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    phone: "",
    hospitalId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [currentStep, setCurrentStep] = useState<SignupStep>("userInfo");
  const [formError, setFormError] = useState<string | null>(null);
  const [phoneOtp, setPhoneOtp] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null); // Clear error when user makes changes
  };

  const validateUserInfo = () => {
    // Basic validation for the first step
    if (!formData.name.trim()) {
      setFormError("Please enter your name");
      return false;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormError("Phone number must be 10 digits");
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return false;
    }

    // If hospital ID is provided, validate its format
    if (formData.hospitalId && !/^(H\d{5}|dr-\d{5})$/i.test(formData.hospitalId)) {
      setFormError("Hospital ID must be in format H12345 or dr-12345");
      return false;
    }
    
    return true;
  };

  const validatePasswords = () => {
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateUserInfo()) {
      return;
    }
    
    setIsSendingOtp(true);
    setFormError(null);
    
    try {
      // API calls to send real OTPs to phone and email
      const phoneResponse = await fetch('/api/send-phone-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone })
      });
      
      const emailResponse = await fetch('/api/send-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });
      
      if (!phoneResponse.ok || !emailResponse.ok) {
        throw new Error("Failed to send verification codes. Please try again.");
      }
      
      // Move to verification step
      setCurrentStep("verification");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setFormError("Failed to send verification codes. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    setFormError(null);
    
    try {
      // Validate phone OTP
      if (!phoneVerified) {
        const phoneVerifyResponse = await fetch('/api/verify-phone-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: formData.phone, otp: phoneOtp })
        });
        
        const phoneResult = await phoneVerifyResponse.json();
        
        if (!phoneVerifyResponse.ok || !phoneResult.success) {
          throw new Error("Invalid phone verification code");
        }
        
        setPhoneVerified(true);
      }
      
      // Validate email OTP
      if (!emailVerified) {
        const emailVerifyResponse = await fetch('/api/verify-email-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email, otp: emailOtp })
        });
        
        const emailResult = await emailVerifyResponse.json();
        
        if (!emailVerifyResponse.ok || !emailResult.success) {
          throw new Error("Invalid email verification code");
        }
        
        setEmailVerified(true);
      }
      
      // If both verified successfully, move to password creation
      setCurrentStep("password");
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Verification failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Final validation before submission
    if (currentStep === "password" && !validatePasswords()) {
      return;
    }
    
    try {
      const submissionData = {
        ...formData,
        phoneVerified,
        emailVerified
      };
      
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Signup submission error:", error);
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred during signup");
      }
    }
  };

  const renderUserInfoStep = () => (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading || isSendingOtp}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <Input
          id="phone"
          name="phone"
          placeholder="Enter your 10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading || isSendingOtp}
          required
        />
        <p className="text-xs text-gray-500">Must be a 10-digit number</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading || isSendingOtp}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="hospitalId" className="text-sm font-medium">Hospital ID (UHID) <span className="text-xs text-gray-500 ml-1">(optional)</span></label>
        <Input
          id="hospitalId"
          name="hospitalId"
          placeholder="Enter your hospital ID if available"
          value={formData.hospitalId}
          onChange={handleChange}
          disabled={isLoading || isSendingOtp}
        />
        <p className="text-xs text-gray-500">
          You can add this later in your patient portal
        </p>
      </div>
      
      <Button 
        type="button" 
        className="w-full" 
        disabled={isLoading || isSendingOtp}
        onClick={handleSendOtp}
      >
        {isSendingOtp ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Verification Codes...
          </>
        ) : "Continue to Verification"}
      </Button>
    </>
  );

  const renderVerificationStep = () => (
    <>
      <div className="space-y-5">
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Verification codes have been sent to your phone and email. Please enter them below.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Verification Code</label>
          <OTPInput
            length={6}
            onComplete={(value) => setPhoneOtp(value)}
            value={phoneOtp}
          />
          {phoneVerified && <p className="text-sm text-green-600">Phone verified</p>}
        </div>
        
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Email Verification Code</label>
          <OTPInput
            length={6}
            onComplete={(value) => setEmailOtp(value)}
            value={emailOtp}
          />
          {emailVerified && <p className="text-sm text-green-600">Email verified</p>}
        </div>
        
        <div className="flex justify-between pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep("userInfo")}
            disabled={isVerifying}
          >
            Back
          </Button>
          
          <Button 
            type="button" 
            onClick={handleVerifyOtp}
            disabled={isVerifying || phoneOtp.length !== 6 || emailOtp.length !== 6}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : "Verify & Continue"}
          </Button>
        </div>
      </div>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="space-y-2">
        <Alert variant="success" className="bg-green-50 border-green-200">
          <InfoIcon className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Your phone and email have been verified successfully!
          </AlertDescription>
        </Alert>
      </div>
    
      <div className="space-y-2 mt-4">
        <label htmlFor="password" className="text-sm font-medium">Create Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <p className="text-xs text-gray-500">Must be at least 6 characters</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setCurrentStep("verification")}
          disabled={isLoading}
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : "Complete Sign Up"}
        </Button>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      {currentStep === "userInfo" && renderUserInfoStep()}
      {currentStep === "verification" && renderVerificationStep()}
      {currentStep === "password" && renderPasswordStep()}
    </form>
  );
};

export default SignUpForm;
