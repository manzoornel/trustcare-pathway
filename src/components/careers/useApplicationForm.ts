
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  FormData, 
  FormErrors, 
  SavedApplication,
  saveApplicationToStorage,
  getApplicationFromStorage,
  clearSavedApplication 
} from "./ApplicationFormTypes";
import { useFormValidation } from "./useFormValidation";

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
    resumeUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Application form steps
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // Save/resume related states
  const [hasSavedApplication, setHasSavedApplication] = useState(false);

  const { validateField, validateForm, hasErrors } = useFormValidation();

  // Check for saved application on initial load
  useEffect(() => {
    const savedApplication = getApplicationFromStorage();
    
    if (savedApplication && 
        savedApplication.selectedCategory === selectedCategory && 
        savedApplication.selectedPosition === selectedPosition) {
      setHasSavedApplication(true);
    }
  }, [selectedCategory, selectedPosition]);

  // Auto-save application progress when form data changes
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

  const handleResumeSavedApplication = () => {
    const savedApplication = getApplicationFromStorage();
    
    if (!savedApplication) {
      toast.error("No saved application found");
      return;
    }
    
    setFormData(savedApplication.formData);
    setOtpVerified(savedApplication.otpVerified);
    setOtpSent(savedApplication.otpVerified); // If OTP was verified, it was also sent
    
    // Mark all fields as touched
    const touchedFields = Object.keys(savedApplication.formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(touchedFields);
    
    setHasSavedApplication(false);
    toast.success("Application progress restored");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // Validate the file
      const error = validateField("resume", file);
      setErrors(prev => ({ ...prev, resume: error }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate the field when it loses focus
    const value = fieldName === "resume" 
      ? resumeFile 
      : fieldName === "termsAccepted" 
        ? termsAccepted 
        : formData[fieldName as keyof typeof formData];
        
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleSendOTP = async () => {
    // Validate email and phone before sending OTP
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    
    setErrors(prev => ({ 
      ...prev, 
      email: emailError,
      phone: phoneError
    }));
    
    setTouched(prev => ({ 
      ...prev, 
      email: true,
      phone: true 
    }));
    
    if (emailError || phoneError) {
      toast.error("Please provide valid email and phone number");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate OTP sending API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSent(true);
      toast.success(`Verification code sent to ${formData.phone} and ${formData.email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP verification is not done yet, trigger it
    if (!otpSent) {
      handleSendOTP();
      return;
    }
    
    // Check if all fields are valid
    const newErrors = validateForm(formData, resumeFile, termsAccepted, otpSent, otpVerified, "");
    setErrors(newErrors);
    
    // Mark all fields as touched to show validation errors
    const allTouched = Object.keys(formData).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      { resume: true, termsAccepted: true }
    );
    setTouched(allTouched);
    
    if (hasErrors(newErrors)) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (!selectedCategory || !selectedPosition) {
      toast.error("Please select a job category and position");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your application has been submitted successfully!");
      
      // Clear saved application on successful submission
      clearSavedApplication();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        resumeUrl: "",
      });
      setResumeFile(null);
      setTermsAccepted(false);
      setTouched({});
      setErrors({});
      setOtpSent(false);
      setOtpVerified(false);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = () => {
    // We're already auto-saving, so just need to show confirmation
    toast.success("Your application progress has been saved. You can return to complete it later.");
  };

  const handleStartNewApplication = () => {
    clearSavedApplication();
    setHasSavedApplication(false);
  };

  return {
    formData,
    resumeFile,
    termsAccepted,
    errors,
    touched,
    isSubmitting,
    otpSent,
    otpVerified,
    hasSavedApplication,
    setTermsAccepted,
    handleInputChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    handleSendOTP,
    handleSaveAndExit,
    handleResumeSavedApplication,
    handleStartNewApplication,
    setOtpVerified,
    setOtpSent
  };
};
