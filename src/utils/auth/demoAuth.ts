
import { AuthState } from "@/types/auth.types";

/**
 * Check if a user is a demo user
 * In production, there are no demo users
 */
export const isDemoUser = (userId?: string): boolean => {
  return false; // No demo users in production
};

/**
 * Handle demo login
 * In production, this always returns null to force real authentication
 */
export const handleDemoLogin = (email: string, password: string): AuthState | null => {
  return null; // No demo login in production
};

/**
 * Handle demo OTP for phone verification
 * In production, this always returns false to force real OTP verification
 */
export const handleDemoOTP = (phone: string): boolean => {
  return false; // No demo OTP in production
};

/**
 * Verify demo OTP
 * In production, this always returns null to force real OTP verification
 */
export const verifyDemoOTP = (phone: string): AuthState | null => {
  return null; // No demo OTP verification in production
};
