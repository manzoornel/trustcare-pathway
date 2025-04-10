
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isDemoUser } from "./demoAuth";

/**
 * Handle user logout
 */
export const handleLogout = async (userId?: string): Promise<void> => {
  // Check if this is a demo account
  if (isDemoUser(userId)) {
    toast.success("Logged out of demo account successfully");
    return;
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  toast.success("Logged out successfully");
};
