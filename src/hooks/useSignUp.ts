
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SignUpFormData, validateSignUpForm } from "@/utils/signupValidation";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (formData: SignUpFormData) => {
    // Validate form data one more time to be safe
    if (!validateSignUpForm(formData)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup process with data:", { 
        email: formData.email, 
        phone: formData.phone, 
        hospitalId: formData.hospitalId 
      });
      
      // Check if hospital ID or phone already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('patient_profiles')
        .select('hospital_id, phone')
        .or(`hospital_id.eq.${formData.hospitalId},phone.eq.${formData.phone}`)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking for existing profiles:", checkError);
        throw checkError;
      }
      
      if (existingProfile) {
        if (existingProfile.hospital_id === formData.hospitalId) {
          toast.error("An account with this Hospital ID already exists");
        } else {
          toast.error("An account with this phone number already exists");
        }
        return;
      }
      
      console.log("No existing profile found, proceeding with signup");
      
      // Sign up the user
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        hospitalId: formData.hospitalId,
      });
      
      console.log("Signup successful, redirecting to verification");
      toast.success("Account created successfully! Redirecting to verification...");
      
      // Update the navigation path to match the route defined in App.tsx (/verify instead of /verify-otp)
      navigate("/verify");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp
  };
};
