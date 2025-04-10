
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handle user registration/signup
 */
export const handleSignUp = async (userData: { 
  name: string, 
  email: string, 
  password: string, 
  phone: string, 
  hospitalId: string 
}): Promise<void> => {
  // Register user with Supabase
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (error) throw error;

  if (data.user) {
    // Create profile for user
    const { error: profileError } = await supabase
      .from('patient_profiles')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        hospital_id: userData.hospitalId,
      });

    if (profileError) throw profileError;

    // Create rewards entry for user
    const { error: rewardsError } = await supabase
      .from('patient_rewards')
      .insert({
        patient_id: data.user.id,
        points: 140, // Starting points
      });

    if (rewardsError) throw rewardsError;

    toast.success("Account created successfully! Please verify your email.");
  }
};
