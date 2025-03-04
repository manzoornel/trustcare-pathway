
import { useState, useEffect } from "react";

interface UseApplicationFormProps {
  initialStep: number;
  onStatusChange: (status: string) => void;
  savedApplication: {
    lastCompletedStep: number | null;
    applicationData: any;
    verifiedPhone: boolean;
    verifiedEmail: boolean;
  } | null;
}

export const useApplicationForm = ({
  initialStep,
  onStatusChange,
  savedApplication,
}: UseApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  // Add the properties that were missing and causing TypeScript errors
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [hasSavedApplication, setHasSavedApplication] = useState(false);

  // Load saved application data if available
  useEffect(() => {
    if (savedApplication) {
      setCurrentStep(savedApplication.lastCompletedStep || initialStep);
      setFormData({
        ...savedApplication.applicationData,
      });
      setVerifiedPhone(savedApplication.verifiedPhone || false);
      setVerifiedEmail(savedApplication.verifiedEmail || false);
      setHasSavedApplication(true);
    }
  }, [savedApplication, initialStep]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (data: any) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleFileChange = (file: File | null) => {
    setResumeFile(file);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      return true;
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError("Failed to submit application. Please try again.");
      return false;
    }
  };

  const handleSaveAndExit = async () => {
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  };

  const handleResumeSavedApplication = () => {
    // Logic to resume saved application
  };

  const handleStartNewApplication = () => {
    // Logic to start a new application
  };

  const handleSendOTP = async (type: 'email' | 'phone') => {
    // Mock OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    return true;
  };

  const resetSubmitError = () => {
    setSubmitError(null);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    formData,
    updateFormData,
    verifiedPhone,
    setPhoneVerificationStatus: setVerifiedPhone,
    verifiedEmail,
    setEmailVerificationStatus: setVerifiedEmail,
    resumeFile,
    termsAccepted,
    errors,
    touched,
    isSubmitting,
    isValidating,
    submitError,
    otpSent,
    otpVerified,
    hasSavedApplication,
    setTermsAccepted,
    handleInputChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    handleSaveAndExit,
    handleResumeSavedApplication,
    handleStartNewApplication,
    setOtpVerified,
    setOtpSent,
    handleSendOTP,
    resetSubmitError
  };
};
