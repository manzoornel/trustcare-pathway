
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/types/auth.types";
import { toast } from "sonner";
import { isDemoUser } from "./demoAuth";

/**
 * Update a user's profile
 */
export const handleUpdateProfile = async (
  userId: string | undefined, 
  profileData: Partial<AuthState>
): Promise<void> => {
  if (!userId) {
    toast.error("Cannot update profile: Not logged in");
    return Promise.reject("Not logged in");
  }
  
  // For demo accounts, we don't need to do anything with the database
  if (isDemoUser(userId)) {
    toast.success("Profile updated successfully (Demo mode)");
    return Promise.resolve();
  }
  
  // Update profile in Supabase
  const { error } = await supabase
    .from('patient_profiles')
    .update({
      name: profileData.name,
      phone: profileData.phone,
      email: profileData.email,
      ...(profileData.hospitalId ? { hospital_id: profileData.hospitalId } : {})
    })
    .eq('id', userId);
    
  if (error) throw error;
  
  toast.success("Profile updated successfully");
};

/**
 * Fetch a user's profile and rewards
 */
export const fetchUserProfile = async (userId: string) => {
  // Get user profile
  const { data: profile } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  // Get user rewards
  const { data: rewards } = await supabase
    .from('patient_rewards')
    .select('points')
    .eq('patient_id', userId)
    .maybeSingle();
    
  return { profile, rewards };
};
