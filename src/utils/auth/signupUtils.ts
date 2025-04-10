
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Credentials } from "@/contexts/auth/types";

/**
 * Handle user registration/signup
 */
export const handleSignUp = async (userData: Credentials): Promise<void> => {
  // Check if email already exists
  const { data: existingUsers, error: searchError } = await supabase
    .from('patient_profiles')
    .select('email')
    .eq('email', userData.email)
    .limit(1);
    
  if (searchError) {
    throw new Error(searchError.message);
  }
    
  if (existingUsers && existingUsers.length > 0) {
    throw new Error('Email already in use. Please login instead.');
  }
    
  // Create new user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    options: {
      data: {
        name: userData.name,
        hospital_id: userData.hospitalId
      }
    }
  });
    
  if (error) {
    throw new Error(error.message);
  }
    
  if (data.user) {
    // Create profile record in our database
    const { error: profileError } = await supabase
      .from('patient_profiles')
      .insert([
        { 
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          hospital_id: userData.hospitalId
        }
      ]);
      
    if (profileError) {
      console.error('Error creating profile:', profileError);
      // We don't throw here because the auth account was already created
    }
  }
};
