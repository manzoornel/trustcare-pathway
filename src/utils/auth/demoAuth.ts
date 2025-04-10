
import { AuthState } from "@/types/auth.types";
import { demoPatients } from "@/data/demoPatients";
import { toast } from "sonner";

/**
 * Handle authentication for demo accounts
 */
export const handleDemoLogin = (email: string, password: string): AuthState | null => {
  const demoPatient = demoPatients.find(patient => patient.email === email);
  
  if (demoPatient && password === demoPatient.password) {
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
  
  return null;
};

/**
 * Handle OTP login for demo accounts
 */
export const handleDemoOTP = (phone: string): boolean => {
  const demoPatient = demoPatients.find(patient => patient.phone === phone);
  
  if (demoPatient) {
    // Store the phone number for verification
    localStorage.setItem('verifyPhone', phone);
    toast.info("OTP sent to your phone (simulated for demo account)");
    return true;
  }
  
  return false;
};

/**
 * Verify OTP for demo accounts
 */
export const verifyDemoOTP = (phone: string): AuthState | null => {
  const demoPatient = demoPatients.find(patient => patient.phone === phone);
  
  if (demoPatient) {
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
  
  return null;
};

/**
 * Check if a user is a demo user
 */
export const isDemoUser = (userId?: string): boolean => {
  return !!userId?.startsWith('demo-');
};
