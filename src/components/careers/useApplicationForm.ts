
import { useState, useEffect } from "react";
import { FormData, FormErrors, SavedApplication, getApplicationFromStorage, saveApplicationToStorage, clearSavedApplication, EMAIL_REGEX, PHONE_REGEX } from "./ApplicationFormTypes";

interface UseApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
}

export const useApplicationForm = ({ selectedCategory, selectedPosition }: UseApplicationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: ""
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [hasSavedApplication, setHasSavedApplication] = useState(false);

  // Check for saved application on mount
  useEffect(() => {
    const savedApp = getApplicationFromStorage();
    if (savedApp && savedApp.selectedCategory === selectedCategory && savedApp.selectedPosition === selectedPosition) {
      setHasSavedApplication(true);
    }
  }, [selectedCategory, selectedPosition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setTouched(prev => ({ ...prev, resume: true }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Name is required (min 3 characters)";
    }
    
    // Validate email
    if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    // Validate phone
    if (!formData.phone || !PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
    }
    
    // Additional validations after OTP verification
    if (otpVerified) {
      // Validate experience
      if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
        newErrors.experience = "Valid years of experience required";
      }
      
      // Validate resume file
      if (!resumeFile) {
        newErrors.resume = "Resume is required";
      }
      
      // Validate terms acceptance
      if (!termsAccepted) {
        newErrors.termsAccepted = "You must accept the terms and conditions";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    // Validate contact info first
    const contactValid = validateForm();
    if (!contactValid) return false;
    
    setIsValidating(true);
    try {
      // Mock API call to validate and send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setIsValidating(false);
      return true;
    } catch (error) {
      setIsValidating(false);
      setSubmitError("Failed to send verification code. Please try again.");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Mock submission to API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved application on successful submit
      clearSavedApplication();
      
      setIsSubmitting(false);
      return true;
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError("Failed to submit application. Please try again.");
      return false;
    }
  };

  const handleSaveAndExit = () => {
    // Save current application state to localStorage
    const applicationData: SavedApplication = {
      formData,
      selectedCategory,
      selectedPosition,
      lastUpdated: Date.now(),
      otpVerified
    };
    
    saveApplicationToStorage(applicationData);
    
    // You could redirect or show a toast notification here
    alert("Your application has been saved. You can resume later.");
  };

  const handleResumeSavedApplication = () => {
    const savedApp = getApplicationFromStorage();
    if (savedApp) {
      setFormData(savedApp.formData);
      setOtpVerified(savedApp.otpVerified);
      if (savedApp.otpVerified) {
        setOtpSent(true);
      }
      setHasSavedApplication(false);
    }
  };

  const handleStartNewApplication = () => {
    clearSavedApplication();
    setHasSavedApplication(false);
  };

  const resetSubmitError = () => {
    setSubmitError(null);
  };

  return {
    formData,
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
