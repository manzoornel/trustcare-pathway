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
  role?: string;
  patient_id?: any;
};

export type DemoPatient = {
  name: string;
  hospitalId: string;
  email: string;
  password: string;
  phone: string;
};

export interface Credentials {
  email: string;
  password: string;
  name: string;
  phone: string;
  hospitalId?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

export type UserProfile = Partial<{
  name: string;
  email: string;
  phone: string;
  hospitalId: string;
}>;

export type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthState>) => Promise<void>;
  verifyUser: () => void;
  signup: (userData: Credentials) => Promise<void>;
};

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  needsProfile: false,
  isVerified: false,
  rewardPoints: 0,
};
