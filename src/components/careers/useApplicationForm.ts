
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { FormData, FormErrors, SavedApplication, saveApplicationToStorage, getApplicationFromStorage, clearSavedApplication } from "./ApplicationFormTypes";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { useSavedApplication } from "./hooks/useSavedApplication";

interface UseApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
}

export const useApplicationForm = ({ selectedCategory, selectedPosition }: UseApplicationFormProps) => {
  // Main form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Get functionality from custom hooks
  const { 
    hasSavedApplication, 
    handleResumeSavedApplication, 
    handleStartNewApplication,
    handleSaveAndExit 
  } = useSavedApplication({ 
    formData, 
    setFormData, 
    resumeFile, 
    setResumeFile, 
    termsAccepted, 
    setTermsAccepted,
    otpVerified,
    setOtpVerified,
    selectedCategory, 
    selectedPosition,
    setOtpSent
  });

  const {
    isSubmitting,
    isValidating,
    submitError,
    errors,
    touched,
    setTouched,
    setErrors,
    handleSubmit,
    resetSubmitError,
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

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle file upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file && file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setResumeFile(file);
  }, []);

  // Handle OTP sending
  const handleSendOTP = useCallback(() => {
    // Validate email and phone before sending OTP
    const emailError = formData.email.trim() === '' || 
                       !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
    
    const phoneError = formData.phone.trim() === '' || 
                       !/^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(formData.phone);
    
    if (emailError || phoneError) {
      setErrors({
        ...(emailError ? { email: 'Valid email is required' } : {}),
        ...(phoneError ? { phone: 'Valid phone number is required' } : {})
      });
      
      setTouched({
        email: true,
        phone: true
      });
      
      return;
    }
    
    // Simulate OTP sending
    toast.info("Sending verification code...");
    
    setTimeout(() => {
      setOtpSent(true);
      toast.success("Verification code sent to your email and phone");
    }, 1500);
  }, [formData.email, formData.phone, setErrors, setTouched]);

  return {
    formData,
    setFormData,
    resumeFile,
    setResumeFile,
    termsAccepted,
    setTermsAccepted,
    otpSent,
    setOtpSent,
    otpVerified,
    setOtpVerified,
    isSubmitting,
    isValidating,
    submitError,
    errors,
    touched,
    hasSavedApplication,
    handleInputChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    handleSaveAndExit,
    handleResumeSavedApplication,
    handleStartNewApplication,
    handleSendOTP,
    resetSubmitError
  };
};
