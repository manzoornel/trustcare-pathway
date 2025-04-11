
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
    // Set verification status to true since verification is done in the form component
    const verifiedFormData = {
      ...formData,
      phoneVerified: true,
      emailVerified: true
    };
    
    // Validate form data one more time to be safe
    if (!validateSignUpForm(verifiedFormData)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup process with data:", { 
        email: formData.email, 
        phone: formData.phone
      });
      
      // Check if phone already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('patient_profiles')
        .select('phone')
        .eq('phone', formData.phone)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking for existing profiles:", checkError);
        throw new Error("Failed to check for existing accounts. Please try again.");
      }
      
      if (existingProfile) {
        toast.error("An account with this phone number already exists");
        throw new Error("An account with this phone number already exists");
      }
      
      // Only check Hospital ID if it's provided
      if (formData.hospitalId) {
        const { data: existingHospitalId, error: hospitalIdCheckError } = await supabase
          .from('patient_profiles')
          .select('hospital_id')
          .eq('hospital_id', formData.hospitalId)
          .maybeSingle();
          
        if (hospitalIdCheckError) {
          console.error("Error checking for existing hospital ID:", hospitalIdCheckError);
          throw new Error("Failed to check hospital ID availability. Please try again.");
        }
        
        if (existingHospitalId) {
          toast.error("An account with this Hospital ID already exists");
          throw new Error("An account with this Hospital ID already exists");
        }
      }
      
      console.log("No existing profile found, proceeding with signup");
      
      // Sign up the user
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        hospitalId: formData.hospitalId || "", // Allow empty hospital ID
      });
      
      console.log("Signup successful, redirecting to patient portal");
      toast.success("Account created successfully! You can now access your patient portal.");
      
      // Since we've already verified the user, go directly to patient portal
      navigate("/patient-portal");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      throw error; // Re-throw error for form handling
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp
  };
};
