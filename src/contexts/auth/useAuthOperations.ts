
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthState, Credentials } from './types';
import { useDemoAuth } from './useDemoAuth';
import { handleLogin, handleLoginWithOTP, handleVerifyOTP } from '@/utils/auth/loginUtils';
import { handleSignUp } from '@/utils/auth/signupUtils';
import { handleUpdateProfile } from '@/utils/auth/profileUtils';
import { handleLogout } from '@/utils/auth/logoutUtils';

export function useAuthOperations() {
  const [auth, setAuth] = useState<AuthState>(() => {
    // Check if there's session data in localStorage
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth) as AuthState;
      } catch (error) {
        console.error('Failed to parse saved auth state:', error);
      }
    }
    return {
      isAuthenticated: false,
      needsProfile: false,
      isVerified: false,
      rewardPoints: 0,
    };
  });

  const { handleDemoLogin, isDemoUser } = useDemoAuth();

  // Save auth state to localStorage whenever it changes
  const updateAuthState = (newState: AuthState | ((prev: AuthState) => AuthState)) => {
    setAuth(prevState => {
      const nextState = typeof newState === 'function' ? newState(prevState) : newState;
      console.log("Updating auth state:", nextState);
      localStorage.setItem('authState', JSON.stringify(nextState));
      return nextState;
    });
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in with email:", email);
      
      // Check if it's a demo account
      const demoAuthState = handleDemoLogin(email, password);
      
      if (demoAuthState) {
        updateAuthState(demoAuthState);
        return;
      }
      
      // For real users, validate with Supabase
      const authState = await handleLogin(email, password);
      if (authState) {
        updateAuthState(authState);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const loginWithOTP = async (phone: string) => {
    try {
      console.log("Sending OTP to phone:", phone);
      await handleLoginWithOTP(phone);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      console.log("Verifying OTP for phone:", phone);
      const authState = await handleVerifyOTP(phone, otp);
      if (authState) {
        console.log("OTP verified, updating auth state:", authState);
        updateAuthState(authState);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await handleLogout(auth.userId);
      
      updateAuthState({
        isAuthenticated: false,
        needsProfile: false,
        isVerified: false,
        rewardPoints: 0,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<AuthState>) => {
    try {
      // Only update if user is authenticated
      if (!auth.isAuthenticated) {
        throw new Error('You must be logged in to update your profile');
      }
      
      await handleUpdateProfile(auth.userId, profileData);
      
      // Update local state
      updateAuthState(prevAuth => ({
        ...prevAuth,
        ...profileData,
        needsProfile: false,
        profileComplete: true
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  // This function is used after signup to mark the user as verified
  const verifyUser = () => {
    console.log("Marking user as verified in auth context");
    updateAuthState(prevAuth => {
      const newAuth = {
        ...prevAuth,
        isVerified: true
      };
      console.log("Updated auth state after verification:", newAuth);
      return newAuth;
    });
  };

  const signup = async (userData: Credentials) => {
    try {
      await handleSignUp(userData);
      
      // Update local state - now mark the user as already verified
      updateAuthState({
        isAuthenticated: true,
        isVerified: true, // Mark as already verified since we did OTP verification in the form
        needsProfile: false,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        hospitalId: userData.hospitalId,
        profileComplete: true,
        userId: '', // Will be filled by auth state change
        rewardPoints: 0
      });
      
      toast.success('Account created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  return {
    auth,
    login,
    loginWithOTP,
    verifyOTP,
    logout,
    updateProfile,
    verifyUser,
    signup
  };
}
