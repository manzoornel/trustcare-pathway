
export type AuthState = {
  isAuthenticated: boolean;
  needsProfile: boolean;
  isVerified: boolean;
  name?: string | null;
  phone?: string | null;
  hospitalId?: string | null;
  email?: string | null;
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

export type Credentials = {
  name: string;
  email: string;
  password: string;
  phone: string;
  hospitalId: string;
};

export type UserProfile = Partial<{
  name: string | null;
  email: string | null;
  phone: string | null;
  hospitalId: string | null;
}>;

export type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  verifyUser: () => void;
  signup: (userData: Credentials) => Promise<void>;
};

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  needsProfile: false,
  isVerified: false,
  rewardPoints: 0,
};
