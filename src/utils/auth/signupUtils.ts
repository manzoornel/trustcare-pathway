
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
    console.error("Error checking for existing email:", searchError);
    throw new Error("Failed to check email availability. Please try again.");
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
        hospital_id: userData.hospitalId || null
      }
    }
  });
    
  if (error) {
    console.error("Supabase signup error:", error);
    throw new Error(error.message || "Failed to create account");
  }
    
  if (data.user) {
    console.log("User created in auth system, creating profile record");
    
    // Create profile record in our database
    const { error: profileError } = await supabase
      .from('patient_profiles')
      .insert([
        { 
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          hospital_id: userData.hospitalId || null
        }
      ]);
      
    if (profileError) {
      console.error('Error creating profile:', profileError);
      // We log the error but don't throw here because the auth account was already created
      toast.warning("Account created but profile setup incomplete. Please contact support if you experience issues.");
    }
  } else {
    console.warn("User object not available after signup");
  }
  
  console.log("Signup process completed successfully");
};
