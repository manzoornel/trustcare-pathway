
import { FormData, FormErrors, EMAIL_REGEX, PHONE_REGEX } from "./ApplicationFormTypes";

export const useFormValidation = () => {
  const validateField = (name: string, value: string | File | null | boolean): string | undefined => {
    switch (name) {
      case "name":
        return value && typeof value === 'string' && value.trim().length >= 3 
          ? undefined 
          : "Full name is required (minimum 3 characters)";
      case "email":
        return value && typeof value === 'string' && EMAIL_REGEX.test(value) 
          ? undefined 
          : "Please enter a valid email address";
      case "phone":
        return value && typeof value === 'string' && PHONE_REGEX.test(value) 
          ? undefined 
          : "Please enter a valid phone number";
      case "experience":
        return value && typeof value === 'string' && !isNaN(Number(value)) 
          ? undefined 
          : "Please enter a valid number of years";
      case "resume":
        return value 
          ? undefined 
          : "Please upload your resume (PDF format)";
      case "termsAccepted":
        return value === true 
          ? undefined 
          : "You must accept the terms and conditions";
      case "otp":
        return value && typeof value === 'string' && value.length === 6
          ? undefined
          : "Please enter the 6-digit verification code";
      default:
        return undefined;
    }
  };

  const validateForm = (
    formData: FormData, 
    resumeFile: File | null, 
    termsAccepted: boolean, 
    otpSent: boolean, 
    otpVerified: boolean, 
    otp: string
  ): FormErrors => {
    const errors: FormErrors = {};
    
    // Validate all fields
    errors.name = validateField("name", formData.name);
    errors.email = validateField("email", formData.email);
    errors.phone = validateField("phone", formData.phone);
    errors.experience = validateField("experience", formData.experience);
    errors.resume = validateField("resume", resumeFile);
    errors.termsAccepted = validateField("termsAccepted", termsAccepted);
    
    // Only validate OTP if we're in the verification step
    if (otpSent && !otpVerified) {
      errors.otp = validateField("otp", otp);
    }
    
    return errors;
  };

  const hasErrors = (errors: FormErrors): boolean => {
    return Object.values(errors).some(error => error !== undefined);
  };

  return { validateField, validateForm, hasErrors };
};
