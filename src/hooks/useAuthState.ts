
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, defaultAuthState } from '@/types/auth.types';
import { getDemoPatient } from '@/data/demoPatients';

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);

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
              isVerified: true,
              needsProfile: false,
              userId: user.id,
              email: user.email,
              name: demoData?.name || null,
              phone: demoData?.phone || null,
              hospitalId: demoData?.hospitalId || null,
              rewardPoints: 250, // Demo reward points
            });
          } else {
            setAuth({
              isAuthenticated: true,
              isVerified: true,
              needsProfile: false,
              userId: user.id,
              email: user.email,
              name: user.user_metadata?.name || null,
              phone: user.phone || null,
              hospitalId: user.user_metadata?.hospitalId || null,
              rewardPoints: 0,
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
              isVerified: true,
              needsProfile: false,
              userId: user.id,
              email: user.email,
              name: demoData?.name || null,
              phone: demoData?.phone || null,
              hospitalId: demoData?.hospitalId || null,
              rewardPoints: 250, // Demo reward points
            });
          } else {
            setAuth({
              isAuthenticated: true,
              isVerified: true,
              needsProfile: false,
              userId: user.id,
              email: user.email,
              name: user.user_metadata?.name || null,
              phone: user.phone || null,
              hospitalId: user.user_metadata?.hospitalId || null,
              rewardPoints: 0,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuth(defaultAuthState);
        }
      }
    );
    
    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    auth,
    setAuth
  };
};
