
import { useState } from "react";
import { toast } from "sonner";
import { FormData, FormErrors, clearSavedApplication } from "../ApplicationFormTypes";
import { useFormValidation } from "../useFormValidation";
import { supabase } from "@/integrations/supabase/client";

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
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { validateField, validateForm, hasErrors } = useFormValidation();

  // Function to perform server-side validation
  const performServerValidation = async (): Promise<{ valid: boolean, errors: FormErrors }> => {
    setIsValidating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-application', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience
        }
      });
      
      if (error) {
        console.error('Server validation error:', error);
        toast.error('Error validating form data');
        return { valid: false, errors: {} };
      }
      
      return data as { valid: boolean, errors: FormErrors };
    } catch (err) {
      console.error('Error during server validation:', err);
      return { valid: false, errors: {} };
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous submission error
    setSubmitError(null);
    
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
      // First perform client-side validation
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
        
        // Perform server-side validation
        const serverValidation = await performServerValidation();
        
        if (!serverValidation.valid && Object.keys(serverValidation.errors).length > 0) {
          // Update our errors with server validation errors
          setErrors(prev => ({ ...prev, ...serverValidation.errors }));
          toast.error("Please fix the validation errors");
          return;
        }
        
        // Simulate API submission
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // 10% chance of simulated error for testing
            if (Math.random() < 0.1) {
              reject(new Error("Network connection error"));
            } else {
              resolve(true);
            }
          }, 1500);
        });
        
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
        const errorMessage = error instanceof Error ? error.message : "Failed to submit application";
        setSubmitError(errorMessage);
        toast.error(errorMessage + ". Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetSubmitError = () => {
    setSubmitError(null);
  };

  return {
    isSubmitting,
    isValidating,
    submitError,
    errors,
    touched,
    setTouched,
    setErrors,
    handleSubmit,
    resetSubmitError,
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
