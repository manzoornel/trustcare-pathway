
export type AuthState = {
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

export type DemoPatient = {
  name: string;
  hospitalId: string;
  email: string;
  password: string;
  phone: string;
};

export type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthState>) => Promise<void>;
  verifyUser: () => void;
  signUp: (userData: { name: string, email: string, password: string, phone: string, hospitalId: string }) => Promise<void>;
};

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  needsProfile: false,
  isVerified: false,
  rewardPoints: 0,
};
