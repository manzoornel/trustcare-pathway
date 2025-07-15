
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Get user profile information
  const { data: profile, error: profileError } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('id', data.user?.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }

  const authState: AuthState = {
    isAuthenticated: true,
    isVerified: true, // Email/password login is considered verified
    needsProfile: !profile,
    userId: data.user?.id,
    name: profile?.name,
    email: profile?.email || data.user?.email,
    phone: profile?.phone,
    hospitalId: profile?.hospital_id,
    profileComplete: !!profile,
    rewardPoints: 0,
  };

  toast.success("Login successful!");
  return authState;
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
  
  try {
    // Check if user exists with this phone
    const { data: profile, error: profileError } = await supabase
      .from('patient_profiles')
      .select('id, email')
      .eq('phone', phone)
      .maybeSingle();
      
    if (profileError) throw profileError;
    
    if (!profile) {
      throw new Error('No account found with this phone number');
    }
    
    // In a real implementation, this would send an OTP via SMS
    // For demo purposes, call the send-phone-otp edge function
    const { data: otpResponse, error: otpError } = await supabase.functions.invoke('send-phone-otp', {
      body: { phone }
    });
    
    if (otpError) throw otpError;
    
    if (!otpResponse.success) {
      throw new Error(otpResponse.message || 'Failed to send OTP');
    }
    
    toast.success("OTP sent successfully");
    
    // Store the phone number for verification
    localStorage.setItem('verifyPhone', phone);
    
    return Promise.resolve();
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    throw error;
  }
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
  
  try {
    // In a real implementation, verify OTP with Supabase edge function
    const { data: verifyResponse, error: verifyError } = await supabase.functions.invoke('verify-phone-otp', {
      body: { phone, otp }
    });
    
    if (verifyError) throw verifyError;
    
    if (!verifyResponse.success) {
      throw new Error(verifyResponse.message || 'Failed to verify OTP');
    }
    
    // Find user by phone number
    const { data: profile, error } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!profile) {
      throw new Error('No account found with this phone number');
    }
    
    // Get auth user details if available
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (e) {
      console.error("Error getting user:", e);
    }
    
    // Create auth state
    const authState: AuthState = {
      isAuthenticated: true,
      isVerified: true,
      needsProfile: false,
      userId: user?.id || profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      hospitalId: profile.hospital_id,
      profileComplete: true,
      rewardPoints: 0,
    };
    
    toast.success("OTP verified successfully!");
    return authState;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
