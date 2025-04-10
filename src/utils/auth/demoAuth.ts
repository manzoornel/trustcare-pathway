
import { toast } from "sonner";
import { demoPatients } from "@/data/demoPatients";
import { AuthState } from "@/types/auth.types";

/**
 * Check if a user is a demo user
 */
export const isDemoUser = (userId?: string): boolean => {
  return !!userId?.startsWith('demo-');
};

/**
 * Handle demo login
 */
export const handleDemoLogin = (email: string, password: string): AuthState | null => {
  // Check if it's a demo account
  const demoUser = demoPatients.find(p => p.email === email && p.password === password);
  
  if (demoUser) {
    const authState: AuthState = {
      isAuthenticated: true,
      isVerified: true,
      needsProfile: false,
      name: demoUser.name,
      email: demoUser.email,
      phone: demoUser.phone,
      hospitalId: demoUser.hospitalId,
      profileComplete: true,
      userId: `demo-${Date.now()}`,
      rewardPoints: 250
    };
    
    toast.success(`Welcome, ${demoUser.name}! You're logged in as a demo user.`);
    return authState;
  }
  
  return null;
};

/**
 * Handle demo OTP for phone verification
 */
export const handleDemoOTP = (phone: string): boolean => {
  const isDemoNumber = demoPatients.some(patient => patient.phone === phone);
  
  if (isDemoNumber) {
    toast.success("Demo OTP sent to your phone (simulated)");
    return true;
  }
  
  return false;
};

/**
 * Verify demo OTP
 */
export const verifyDemoOTP = (phone: string): AuthState | null => {
  const demoUser = demoPatients.find(p => p.phone === phone);
  
  if (demoUser) {
    const authState: AuthState = {
      isAuthenticated: true,
      isVerified: true,
      needsProfile: false,
      name: demoUser.name,
      email: demoUser.email,
      phone: demoUser.phone,
      hospitalId: demoUser.hospitalId,
      profileComplete: true,
      userId: `demo-${Date.now()}`,
      rewardPoints: 250
    };
    
    toast.success(`Welcome, ${demoUser.name}! You're logged in as a demo user.`);
    return authState;
  }
  
  return null;
};
