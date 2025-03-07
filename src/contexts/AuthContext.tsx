
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthState = {
  isAuthenticated: boolean;
  needsProfile: boolean;
  isVerified: boolean;
  name?: string;
  phone?: string;
  hospitalId?: string;
  email?: string;
  profileComplete?: boolean;
  rewardPoints?: number;
  userId?: string;
};

type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthState>) => Promise<void>;
  verifyUser: () => void;
  signUp: (userData: { name: string, email: string, password: string, phone: string, hospitalId: string }) => Promise<void>;
};

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  needsProfile: false,
  isVerified: false,
  rewardPoints: 0,
};

// Demo patients that can be used for quick login
// This should match the data in the Login component
const demoPatients = [
  {
    name: "John Smith",
    hospitalId: "H12345",
    email: "john.smith@example.com",
    password: "password123",
    phone: "1234567890"
  },
  {
    name: "Sarah Johnson",
    hospitalId: "H67890",
    email: "sarah.johnson@example.com",
    password: "password123",
    phone: "9876543210"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const getInitialSession = async () => {
      try {
        // Get session from supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile
          const { data: profile } = await supabase
            .from('patient_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // Get user rewards
          const { data: rewards } = await supabase
            .from('patient_rewards')
            .select('points')
            .eq('patient_id', session.user.id)
            .maybeSingle();
            
          setAuth({
            isAuthenticated: true,
            isVerified: true,
            needsProfile: !profile,
            userId: session.user.id,
            name: profile?.name || '',
            email: profile?.email || session.user.email || '',
            phone: profile?.phone || '',
            hospitalId: profile?.hospital_id || '',
            rewardPoints: rewards?.points || 0,
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile
          const { data: profile } = await supabase
            .from('patient_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // Get user rewards
          const { data: rewards } = await supabase
            .from('patient_rewards')
            .select('points')
            .eq('patient_id', session.user.id)
            .maybeSingle();
            
          setAuth({
            isAuthenticated: true,
            isVerified: true,
            needsProfile: !profile,
            userId: session.user.id,
            name: profile?.name || '',
            email: profile?.email || session.user.email || '',
            phone: profile?.phone || '',
            hospitalId: profile?.hospital_id || '',
            rewardPoints: rewards?.points || 0,
          });
        } else if (event === 'SIGNED_OUT') {
          setAuth(defaultAuthState);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (userData: { name: string, email: string, password: string, phone: string, hospitalId: string }) => {
    try {
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
        setAuth({
          ...defaultAuthState,
          isVerified: false,
        });
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const verifyUser = () => {
    setAuth(prev => ({ ...prev, isVerified: true }));
  };

  const login = async (email: string, password: string) => {
    try {
      // Check if this is a demo account
      const demoPatient = demoPatients.find(patient => patient.email === email);
      
      if (demoPatient && password === demoPatient.password) {
        // Simulate a successful login with demo account
        console.log("Demo login successful", demoPatient);
        
        // Create a random user ID for the demo account
        const demoUserId = `demo-${Math.random().toString(36).substring(2, 15)}`;
        
        setAuth({
          isAuthenticated: true,
          isVerified: true,
          needsProfile: false,
          userId: demoUserId,
          name: demoPatient.name,
          email: demoPatient.email,
          phone: demoPatient.phone,
          hospitalId: demoPatient.hospitalId,
          rewardPoints: 250, // Demo reward points
        });
        
        toast.success("Demo login successful!");
        return;
      }
      
      // Real authentication with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const loginWithOTP = async (phone: string) => {
    try {
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
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      // Check if this is a demo account
      const demoPatient = demoPatients.find(patient => patient.phone === phone);
      
      if (demoPatient) {
        // Simulate a successful verification for demo account
        console.log("Demo OTP verification successful", demoPatient);
        
        // Create a random user ID for the demo account
        const demoUserId = `demo-${Math.random().toString(36).substring(2, 15)}`;
        
        setAuth({
          isAuthenticated: true,
          isVerified: true,
          needsProfile: false,
          userId: demoUserId,
          name: demoPatient.name,
          email: demoPatient.email,
          phone: demoPatient.phone,
          hospitalId: demoPatient.hospitalId,
          rewardPoints: 250, // Demo reward points
        });
        
        toast.success("Demo OTP verified successfully!");
        return Promise.resolve();
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
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Failed to verify OTP');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if this is a demo account
      if (auth.userId?.startsWith('demo-')) {
        setAuth(defaultAuthState);
        toast.success("Logged out of demo account successfully");
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuth(defaultAuthState);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  const updateProfile = async (profileData: Partial<AuthState>) => {
    if (!auth.userId) {
      toast.error("Cannot update profile: Not logged in");
      return Promise.reject("Not logged in");
    }
    
    // For demo accounts, update only in memory
    if (auth.userId.startsWith('demo-')) {
      setAuth(prev => ({ ...prev, ...profileData }));
      toast.success("Profile updated successfully (Demo mode)");
      return Promise.resolve();
    }
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('patient_profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          email: profileData.email,
          ...(profileData.hospitalId ? { hospital_id: profileData.hospitalId } : {})
        })
        .eq('id', auth.userId);
        
      if (error) throw error;
      
      // Update local auth state
      const updatedAuth = { ...auth, ...profileData };
      setAuth(updatedAuth);
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
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
        updateProfile, 
        verifyUser, 
        signUp 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
