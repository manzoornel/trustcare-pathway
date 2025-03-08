
import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';
import { 
  AuthState, 
  Credentials, 
  UserProfile, 
  AuthContextType 
} from '@/types/auth.types';
import { 
  handleLogin, 
  handleLoginWithOTP, 
  handleLogout, 
  handleSignUp, 
  handleUpdateProfile, 
  handleVerifyOTP 
} from '@/utils/authUtils';
import { useAuthState } from '@/hooks/useAuthState';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  auth: {
    isAuthenticated: false,
    needsProfile: false,
    isVerified: false
  },
  login: async () => {},
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  logout: async () => {},
  signup: async () => {},
  updateProfile: async () => {},
  verifyUser: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth, setAuth } = useAuthState();
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const authState = await handleLogin(email, password);
      if (Object.keys(authState).length > 0) {
        setAuth(authState);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // Login with OTP
  const loginWithOTP = async (phone: string) => {
    try {
      await handleLoginWithOTP(phone);
    } catch (error: any) {
      console.error("OTP send error:", error);
      throw error;
    }
  };
  
  // Verify OTP
  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const authState = await handleVerifyOTP(phone, otp);
      if (authState) {
        setAuth(authState);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await handleLogout(auth.userId);
      setAuth({
        isAuthenticated: false,
        needsProfile: false,
        isVerified: false
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  };
  
  // Sign up
  const signup = async (credentials: Credentials) => {
    try {
      await handleSignUp(credentials);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      await handleUpdateProfile(auth.userId, profile);
      
      setAuth(prev => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        hospitalId: profile.hospitalId || prev.hospitalId
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  // Verify user (for after OTP verification)
  const verifyUser = () => {
    setAuth(prev => ({
      ...prev,
      isVerified: true,
    }));
  };
  
  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        loginWithOTP,
        verifyOTP,
        logout,
        signup,
        updateProfile,
        verifyUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
