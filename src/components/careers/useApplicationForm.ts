
import { useState, useEffect } from "react";
import { 
  FormData, 
  SavedApplication,
  saveApplicationToStorage
} from "./ApplicationFormTypes";
import { useOTPVerification } from "./hooks/useOTPVerification";
import { useSavedApplication } from "./hooks/useSavedApplication";
import { useFormSubmission } from "./hooks/useFormSubmission";

interface UseApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
}

export const useApplicationForm = ({ selectedCategory, selectedPosition }: UseApplicationFormProps) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Initialize hooks
  const {
    otpSent,
    otpVerified,
    isSubmitting: otpSubmitting,
    setOtpSent,
    setOtpVerified,
    handleSendOTP
  } = useOTPVerification({ 
    email: formData.email, 
    phone: formData.phone 
  });
  
  const {
    hasSavedApplication,
    handleResumeSavedApplication,
    handleStartNewApplication,
    handleSaveAndExit
  } = useSavedApplication({ 
    selectedCategory, 
    selectedPosition 
  });
  
  const {
    isSubmitting: formSubmitting,
    errors,
    touched,
    handleSubmit,
    handleBlur
  } = useFormSubmission({
    formData,
    resumeFile,
    termsAccepted,
    otpSent,
    otpVerified,
    selectedCategory,
    selectedPosition,
    setFormData,
    setResumeFile,
    setTermsAccepted,
    setOtpSent,
    setOtpVerified
  });
  
  // Save application state when form data changes
  useEffect(() => {
    if (formData.name || formData.email || formData.phone || formData.experience) {
      const applicationData: SavedApplication = {
        formData,
        selectedCategory,
        selectedPosition,
        lastUpdated: Date.now(),
        otpVerified
      };
      
      saveApplicationToStorage(applicationData);
    }
  }, [formData, selectedCategory, selectedPosition, otpVerified]);
  
  // Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched on change
    const newTouched = { ...touched, [name]: true };
    
    // Validate field
    handleBlur(name);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // Validate file
      handleBlur("resume");
    }
  };
  
  // Resume saved application
  const handleResumeSavedApplicationWrapper = () => {
    const savedApplication = handleResumeSavedApplication();
    
    if (savedApplication) {
      setFormData(savedApplication.formData);
      setOtpVerified(savedApplication.otpVerified);
      setOtpSent(savedApplication.otpVerified);
      
      const touchedFields = Object.keys(savedApplication.formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
    }
  };
  
  return {
    // Form state
    formData,
    resumeFile,
    termsAccepted,
    errors,
    touched,
    isSubmitting: otpSubmitting || formSubmitting,
    otpSent,
    otpVerified,
    hasSavedApplication,
    
    // State setters
    setTermsAccepted,
    
    // Event handlers
    handleInputChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    handleSendOTP,
    handleSaveAndExit,
    handleResumeSavedApplication: handleResumeSavedApplicationWrapper,
    handleStartNewApplication,
    
    // OTP handlers
    setOtpVerified,
    setOtpSent
  };
};
