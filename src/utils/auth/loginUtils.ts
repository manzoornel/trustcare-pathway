
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/types/auth.types";
import { toast } from "sonner";
import { handleDemoLogin, verifyDemoOTP, handleDemoOTP } from "./demoAuth";

/**
 * Handle user login with email and password
 */
export const handleLogin = async (email: string, password: string): Promise<AuthState | undefined> => {
  // Check if this is a demo account
  const demoAuth = handleDemoLogin(email, password);
  if (demoAuth) {
    return demoAuth;
  }
  
  // Real authentication with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  toast.success("Login successful!");
  return undefined; // Session will be handled by onAuthStateChange
};

/**
 * Handle login with OTP via phone number
 */
export const handleLoginWithOTP = async (phone: string): Promise<void> => {
  // Check if this is a demo account
  const isDemo = handleDemoOTP(phone);
  
  if (isDemo) {
    return Promise.resolve();
  }
  
  // In a real implementation, this would send an OTP via SMS
  // For this demo, we'll simulate it
  toast.info("OTP sent to your phone (simulated)");
  
  // Store the phone number for verification
  localStorage.setItem('verifyPhone', phone);
  
  return Promise.resolve();
};

/**
 * Verify an OTP code
 */
export const handleVerifyOTP = async (phone: string, otp: string): Promise<AuthState | undefined> => {
  // Check if this is a demo account
  const demoAuth = verifyDemoOTP(phone);
  
  if (demoAuth) {
    return demoAuth;
  }
  
  // In a real implementation, this would verify the OTP
  // For this demo, we'll accept any OTP
  
  // Find user by phone number
  const { data: profile, error } = await supabase
    .from('patient_profiles')
    .select('id, email')
    .eq('phone', phone)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!profile) {
    throw new Error('No account found with this phone number');
  }
  
  // Get user email from profile
  const { data: user, error: authError } = await supabase.auth.signInWithPassword({
    email: profile.email as string,
    // This is just a demo password - in a real app you would use magic link or proper OTP
    password: 'password123',
  });
  
  if (authError) throw authError;
  
  toast.success("OTP verified successfully!");
  return undefined; // Session will be handled by onAuthStateChange
};
