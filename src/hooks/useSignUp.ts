
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SignUpFormData } from "@/utils/signupValidation";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (formData: SignUpFormData) => {
    setIsLoading(true);
    
    try {
      // Check if hospital ID or phone already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('patient_profiles')
        .select('hospital_id, phone')
        .or(`hospital_id.eq.${formData.hospitalId},phone.eq.${formData.phone}`)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingProfile) {
        if (existingProfile.hospital_id === formData.hospitalId) {
          toast.error("An account with this Hospital ID already exists");
        } else {
          toast.error("An account with this phone number already exists");
        }
        return;
      }
      
      // Sign up the user
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        hospitalId: formData.hospitalId,
      });
      
      navigate("/verify-otp");
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
