
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "manager" | "hr";
}

const AdminGuard = ({ children, requiredRole }: AdminGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated with Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          if (location.pathname !== "/admin") {
            navigate("/admin");
          }
          setIsLoading(false);
          return;
        }

        // Check if user has admin role
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (rolesError) throw rolesError;

        const userRoles = roles?.map(r => r.role) || [];
        const hasAdminAccess = userRoles.some(r => ['admin', 'hr', 'manager'].includes(r));

        if (!hasAdminAccess) {
          toast.error("You don't have admin access");
          await supabase.auth.signOut();
          navigate("/admin");
          setIsLoading(false);
          return;
        }

        // Check specific role requirement
        if (requiredRole) {
          const hasRequiredRole = userRoles.includes(requiredRole) || userRoles.includes('admin');
          
          if (!hasRequiredRole) {
            toast.error("You don't have permission to access this page");
            navigate("/admin/dashboard");
            setIsLoading(false);
            return;
          }
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        if (location.pathname !== "/admin") {
          navigate("/admin");
        }
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/admin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, requiredRole]);

  return (
    isLoading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    ) : (
      isAuthenticated ? <>{children}</> : null
    )
  );
};

export default AdminGuard;
