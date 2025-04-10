
// This file now just re-exports functionalities from the demoAuth utility
import { handleDemoLogin, isDemoUser } from '@/utils/auth/demoAuth';

export function useDemoAuth() {
  return {
    handleDemoLogin,
    isDemoUser
  };
}
