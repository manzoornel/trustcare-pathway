
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { updateUser } from "@/utils/auth";

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
};

type AuthContextType = {
  auth: AuthState;
  login: (userData: Partial<AuthState>) => void;
  logout: () => void;
  updateProfile: (profileData: Partial<AuthState>) => void;
  verifyUser: () => void;
  signUp: (userData: Partial<AuthState>) => void;
};

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  needsProfile: false,
  isVerified: false,
  rewardPoints: 0,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedAuth = localStorage.getItem("patientAuth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem("patientAuth");
      }
    }
  }, []);

  const signUp = (userData: Partial<AuthState>) => {
    const newAuth = { 
      ...defaultAuthState, 
      ...userData, 
      isAuthenticated: false,
      isVerified: false,
    };
    setAuth(newAuth);
    localStorage.setItem("patientAuth", JSON.stringify(newAuth));
  };

  const verifyUser = () => {
    const updatedAuth = { 
      ...auth, 
      isVerified: true,
      isAuthenticated: true 
    };
    setAuth(updatedAuth);
    localStorage.setItem("patientAuth", JSON.stringify(updatedAuth));
  };

  const login = (userData: Partial<AuthState>) => {
    // Set default reward points if not provided
    if (userData.rewardPoints === undefined && !auth.rewardPoints) {
      userData.rewardPoints = 140; // Starting with some points for demo
    }
    
    const newAuth = { 
      ...defaultAuthState, 
      ...userData, 
      isAuthenticated: true,
      isVerified: true
    };
    setAuth(newAuth);
    localStorage.setItem("patientAuth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth(defaultAuthState);
    localStorage.removeItem("patientAuth");
    localStorage.removeItem("patientProfile");
  };

  const updateProfile = (profileData: Partial<AuthState>) => {
    if (!auth.hospitalId) {
      console.error("Cannot update profile: Missing hospital ID");
      return;
    }
    
    // Update local auth state
    const updatedAuth = { ...auth, ...profileData };
    setAuth(updatedAuth);
    localStorage.setItem("patientAuth", JSON.stringify(updatedAuth));
    
    // Update the user in the authenticatedUsers array (for demonstration)
    if (profileData.name || profileData.phone || profileData.email) {
      updateUser(auth.hospitalId, {
        name: profileData.name,
        phone: profileData.phone,
        email: profileData.email
      });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateProfile, verifyUser, signUp }}>
      {children}
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
