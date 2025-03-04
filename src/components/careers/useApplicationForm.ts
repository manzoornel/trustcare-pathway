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
  const [formData, setFormData] = useState({});
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);

  // Load saved application data if available
  useEffect(() => {
    if (savedApplication) {
      setCurrentStep(savedApplication.lastCompletedStep || initialStep);
      setFormData({
        ...savedApplication.applicationData,
      });
      setVerifiedPhone(savedApplication.verifiedPhone || false);
      setVerifiedEmail(savedApplication.verifiedEmail || false);
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

  const setPhoneVerificationStatus = (status: boolean) => {
    setVerifiedPhone(status);
  };

  const setEmailVerificationStatus = (status: boolean) => {
    setVerifiedEmail(status);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    formData,
    updateFormData,
    verifiedPhone,
    setPhoneVerificationStatus,
    verifiedEmail,
    setEmailVerificationStatus,
  };
};
