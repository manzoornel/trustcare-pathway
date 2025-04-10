
import React, { createContext, useContext } from 'react';
import { AuthContextType, defaultAuthState } from './types';
import { useAuthOperations } from './useAuthOperations';

// Create the context with default values
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
  const authOperations = useAuthOperations();
  
  return (
    <AuthContext.Provider value={authOperations}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
