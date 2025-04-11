
import { toast } from "sonner";

export interface SignUpFormData {
  name: string;
  phone: string;
  hospitalId: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

export const validateSignUpForm = (formData: SignUpFormData): boolean => {
  console.log("Validating form data:", formData);
  
  // Verify if name is provided
  if (!formData.name.trim()) {
    toast.error("Please enter your name");
    return false;
  }
  
  // Verify if email is in the correct format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return false;
  }
  
  // Verify if email is verified
  if (formData.emailVerified === false) {
    toast.error("Please verify your email address");
    return false;
  }

  // Verify if hospital ID is in the correct format (only if provided)
  if (formData.hospitalId && !/^(H\d{5}|dr-\d{5})$/i.test(formData.hospitalId)) {
    toast.error("Hospital ID must be in format H12345 or dr-12345");
    return false;
  }

  // Verify if phone number is in the correct format
  if (!/^\d{10}$/.test(formData.phone)) {
    toast.error("Phone number must be 10 digits");
    return false;
  }
  
  // Verify if phone is verified
  if (formData.phoneVerified === false) {
    toast.error("Please verify your phone number");
    return false;
  }
  
  // Verify passwords match
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  
  // Verify password length
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  console.log("Form validation successful!");
  return true;
};
