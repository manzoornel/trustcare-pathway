
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthState, Credentials, UserProfile } from '@/types/auth.types';
import { getDemoPatient } from '@/utils/authUtils';

// Create the auth context
const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}>({
  auth: { isAuthenticated: false, userId: null, userEmail: null, userName: null, userPhone: null, hospitalId: null },
  login: async () => {},
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  logout: async () => {},
  signup: async () => {},
  updateProfile: async () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    userEmail: null,
    userName: null,
    userPhone: null,
    hospitalId: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        if (data?.session) {
          const { user } = data.session;
          const isDemoUser = user.id.startsWith('demo-');
          
          if (isDemoUser) {
            const demoData = getDemoPatient(user.email || '');
            setAuth({
              isAuthenticated: true,
              userId: user.id,
              userEmail: user.email,
              userName: demoData?.name || null,
              userPhone: demoData?.phone || null,
              hospitalId: demoData?.hospitalId || null,
            });
          } else {
            setAuth({
              isAuthenticated: true,
              userId: user.id,
              userEmail: user.email,
              userName: user.user_metadata?.name || null,
              userPhone: user.phone || null,
              hospitalId: user.user_metadata?.hospitalId || null,
            });
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;
          const isDemoUser = user.id.startsWith('demo-');
          
          if (isDemoUser) {
            const demoData = getDemoPatient(user.email || '');
            setAuth({
              isAuthenticated: true,
              userId: user.id,
              userEmail: user.email,
              userName: demoData?.name || null,
              userPhone: demoData?.phone || null,
              hospitalId: demoData?.hospitalId || null,
            });
          } else {
            setAuth({
              isAuthenticated: true,
              userId: user.id,
              userEmail: user.email,
              userName: user.user_metadata?.name || null,
              userPhone: user.phone || null,
              hospitalId: user.user_metadata?.hospitalId || null,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuth({
            isAuthenticated: false,
            userId: null,
            userEmail: null,
            userName: null,
            userPhone: null,
            hospitalId: null,
          });
        }
      }
    );
    
    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      // Check if it's a demo account
      const demoPatient = getDemoPatient(email);
      
      if (demoPatient) {
        // This is a demo account, create a custom session
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success(`Welcome, ${demoPatient.name}!`);
        return;
      }
      
      // Regular authentication flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const userName = data.user?.user_metadata?.name || 'Patient';
      toast.success(`Welcome, ${userName}!`);
      
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // Login with OTP
  const loginWithOTP = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("OTP send error:", error);
      throw error;
    }
  };
  
  // Verify OTP
  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      toast.success("Phone verified successfully!");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  };
  
  // Sign up
  const signup = async (credentials: Credentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            hospitalId: credentials.hospitalId,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully! Please verify your email.");
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: profile
      });
      
      if (error) throw error;
      
      setAuth(prev => ({
        ...prev,
        userName: profile.name || prev.userName,
        userEmail: profile.email || prev.userEmail,
        userPhone: profile.phone || prev.userPhone,
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    }
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
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
