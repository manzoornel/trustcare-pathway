
import { toast } from 'react-toastify';
import { demoPatients } from '@/data/demoPatients';
import { AuthState } from './types';

export function useDemoAuth() {
  const handleDemoLogin = (email: string, password: string): AuthState | null => {
    // Check if it's a demo account
    const demoUser = demoPatients.find(p => p.email === email && p.password === password);
    
    if (demoUser) {
      const authState: AuthState = {
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
      };
      
      toast.success(`Welcome, ${demoUser.name}! You're logged in as a demo user.`);
      return authState;
    }
    
    return null;
  };

  const isDemoUser = (userId?: string): boolean => {
    return !!userId?.startsWith('demo-');
  };

  return {
    handleDemoLogin,
    isDemoUser
  };
}
