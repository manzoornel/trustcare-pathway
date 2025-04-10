import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, AuthContextType, defaultAuthState, Credentials, UserProfile } from '@/types/auth.types';
import { demoPatients } from '@/data/demoPatients';

const AuthContext = createContext<AuthContextType>({
  auth: defaultAuthState,
  login: async () => {},
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  verifyUser: () => {},
  signup: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    return defaultAuthState;
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(auth));
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      // Check if it's a demo account
      const demoUser = demoPatients.find(p => p.email === email && p.password === password);
      
      if (demoUser) {
        // For demo users, we don't validate with Supabase
        setAuth({
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
        });
        
        toast.success(`Welcome, ${demoUser.name}! You're logged in as a demo user.`);
        return;
      }
      
      // For real users, validate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // User authenticated successfully
      if (data.user) {
        setAuth({
          isAuthenticated: true,
          isVerified: true,
          needsProfile: false,
          name: data.user.user_metadata.name,
          email: data.user.email || '',
          phone: data.user.phone || '',
          profileComplete: true,
          userId: data.user.id,
          rewardPoints: 0
        });
        toast.success('Login successful!');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const loginWithOTP = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('OTP sent to your phone!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw new Error(error.message);
      }

      // OTP verified successfully
      if (data.user) {
        const needsProfile = !data.user.user_metadata.name;
        
        setAuth({
          isAuthenticated: true,
          isVerified: true,
          needsProfile,
          name: data.user.user_metadata.name,
          email: data.user.email || '',
          phone: data.user.phone || '',
          profileComplete: !needsProfile,
          userId: data.user.id,
          rewardPoints: 0
        });
        
        if (needsProfile) {
          toast.info('Please complete your profile');
        } else {
          toast.success('Login successful!');
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }
      
      setAuth(defaultAuthState);
      toast.success('Logged out successfully');
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
      
      // If not a demo user, update profile in Supabase
      if (!auth.userId?.startsWith('demo-')) {
        const { error } = await supabase.auth.updateUser({
          data: {
            name: profileData.name,
            hospital_id: profileData.hospitalId,
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // Update local state
      setAuth({
        ...auth,
        ...profileData,
        needsProfile: false,
        profileComplete: true
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  // This function is used after signup to mark the user as verified
  const verifyUser = () => {
    console.log("Marking user as verified in auth context");
    setAuth(prevAuth => {
      const newAuth = {
        ...prevAuth,
        isVerified: true
      };
      
      // Save to localStorage immediately for persistence
      localStorage.setItem('authState', JSON.stringify(newAuth));
      
      return newAuth;
    });
  };

  const signup = async (userData: Credentials) => {
    try {
      // Check if email already exists
      const { data: existingUsers, error: searchError } = await supabase
        .from('patient_profiles')
        .select('email')
        .eq('email', userData.email)
        .limit(1);
        
      if (searchError) {
        throw new Error(searchError.message);
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
            hospital_id: userData.hospitalId
          }
        }
      });
        
      if (error) {
        throw new Error(error.message);
      }
        
      if (data.user) {
        // Update local state (but keep isVerified false until they verify email)
        setAuth({
          isAuthenticated: true,
          isVerified: false, // User needs to verify email
          needsProfile: false,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          hospitalId: userData.hospitalId,
          profileComplete: true,
          userId: data.user.id,
          rewardPoints: 0
        });
          
        // Create profile record in our database
        const { error: profileError } = await supabase
          .from('patient_profiles')
          .insert([
            { 
              id: data.user.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              hospital_id: userData.hospitalId
            }
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't throw here because the auth account was already created
        }
          
        toast.success('Signup successful! Please check your email to verify your account.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    auth,
    login,
    loginWithOTP,
    verifyOTP,
    logout,
    updateProfile,
    verifyUser,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
