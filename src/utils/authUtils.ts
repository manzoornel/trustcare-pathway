
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/types/auth.types";
import { demoPatients } from "@/data/demoPatients";
import { toast } from "sonner";

export const handleLogin = async (email: string, password: string): Promise<AuthState> => {
  // Check if this is a demo account
  const demoPatient = demoPatients.find(patient => patient.email === email);
  
  if (demoPatient && password === demoPatient.password) {
    // Simulate a successful login with demo account
    console.log("Demo login successful", demoPatient);
    
    // Create a random user ID for the demo account
    const demoUserId = `demo-${Math.random().toString(36).substring(2, 15)}`;
    
    const auth: AuthState = {
      isAuthenticated: true,
      isVerified: true,
      needsProfile: false,
      userId: demoUserId,
      name: demoPatient.name,
      email: demoPatient.email,
      phone: demoPatient.phone,
      hospitalId: demoPatient.hospitalId,
      rewardPoints: 250, // Demo reward points
    };
    
    toast.success("Demo login successful!");
    return auth;
  }
  
  // Real authentication with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  toast.success("Login successful!");
  return {} as AuthState; // Session will be handled by onAuthStateChange
};

export const handleLoginWithOTP = async (phone: string): Promise<void> => {
  // Check if this is a demo account
  const demoPatient = demoPatients.find(patient => patient.phone === phone);
  
  if (demoPatient) {
    // Store the phone number for verification
    localStorage.setItem('verifyPhone', phone);
    toast.info("OTP sent to your phone (simulated for demo account)");
    return Promise.resolve();
  }
  
  // In a real implementation, this would send an OTP via SMS
  // For this demo, we'll simulate it
  toast.info("OTP sent to your phone (simulated)");
  
  // Store the phone number for verification
  localStorage.setItem('verifyPhone', phone);
  
  return Promise.resolve();
};

export const handleVerifyOTP = async (phone: string, otp: string): Promise<AuthState | undefined> => {
  // Check if this is a demo account
  const demoPatient = demoPatients.find(patient => patient.phone === phone);
  
  if (demoPatient) {
    // Simulate a successful verification for demo account
    console.log("Demo OTP verification successful", demoPatient);
    
    // Create a random user ID for the demo account
    const demoUserId = `demo-${Math.random().toString(36).substring(2, 15)}`;
    
    const auth: AuthState = {
      isAuthenticated: true,
      isVerified: true,
      needsProfile: false,
      userId: demoUserId,
      name: demoPatient.name,
      email: demoPatient.email,
      phone: demoPatient.phone,
      hospitalId: demoPatient.hospitalId,
      rewardPoints: 250, // Demo reward points
    };
    
    toast.success("Demo OTP verified successfully!");
    return auth;
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

export const handleLogout = async (userId?: string): Promise<void> => {
  // Check if this is a demo account
  if (userId?.startsWith('demo-')) {
    toast.success("Logged out of demo account successfully");
    return;
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  toast.success("Logged out successfully");
};

export const handleUpdateProfile = async (
  userId: string | undefined, 
  profileData: Partial<AuthState>
): Promise<void> => {
  if (!userId) {
    toast.error("Cannot update profile: Not logged in");
    return Promise.reject("Not logged in");
  }
  
  // For demo accounts, we don't need to do anything with the database
  if (userId.startsWith('demo-')) {
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
