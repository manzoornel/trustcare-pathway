
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "manager" | "staff";
}

const AdminGuard = ({ children, requiredRole }: AdminGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuthenticated = localStorage.getItem("adminAuthenticated");
      const userRole = localStorage.getItem("adminRole");
      
      if (adminAuthenticated !== "true") {
        navigate("/admin");
        return;
      }
      
      // If a specific role is required, check if the user has it
      if (requiredRole) {
        // Role hierarchy: admin > manager > staff
        const hasPermission = 
          requiredRole === "staff" || 
          (requiredRole === "manager" && (userRole === "admin" || userRole === "manager")) ||
          (requiredRole === "admin" && userRole === "admin");
        
        if (!hasPermission) {
          toast.error("You don't have permission to access this page");
          navigate("/admin/dashboard");
          return;
        }
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location.pathname, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminGuard;
