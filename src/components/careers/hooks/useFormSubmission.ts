
import { useState } from "react";
import { toast } from "sonner";
import { FormData, FormErrors, clearSavedApplication } from "../ApplicationFormTypes";
import { useFormValidation } from "../useFormValidation";

interface UseFormSubmissionProps {
  formData: FormData;
  resumeFile: File | null;
  termsAccepted: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  selectedCategory: string;
  selectedPosition: string;
  setFormData: (data: FormData) => void;
  setResumeFile: (file: File | null) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setOtpSent: (sent: boolean) => void;
  setOtpVerified: (verified: boolean) => void;
}

export const useFormSubmission = ({
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
}: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { validateField, validateForm, hasErrors } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not yet sent OTP, we should validate and send OTP
    if (!otpSent) {
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
      
      return;
    }
    
    // If final form submission
    if (otpVerified) {
      const newErrors = validateForm(formData, resumeFile, termsAccepted, otpSent, otpVerified, "");
      setErrors(newErrors);
      
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
        
        // Simulate API submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success("Your application has been submitted successfully!");
        
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
    }
  };

  return {
    isSubmitting,
    errors,
    touched,
    setTouched,
    setErrors,
    handleSubmit,
    handleBlur: (fieldName: string) => {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
      
      const value = fieldName === "resume" 
        ? resumeFile 
        : fieldName === "termsAccepted" 
          ? termsAccepted 
          : formData[fieldName as keyof typeof formData];
          
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };
};
