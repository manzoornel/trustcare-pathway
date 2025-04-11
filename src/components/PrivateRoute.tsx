
import React, { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

type PrivateRouteProps = {
  children: ReactNode;
  needsProfile?: boolean;
  needsVerification?: boolean;
};

const PrivateRoute = ({ 
  children, 
  needsProfile = false, 
  needsVerification = true 
}: PrivateRouteProps) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // For debugging
  useEffect(() => {
    console.log("Auth state in PrivateRoute:", auth);
    console.log("isAuthenticated:", auth.isAuthenticated);
    console.log("isVerified:", auth.isVerified);
    console.log("needsProfile:", auth.needsProfile);
    
    // To help debug persistence issues, check localStorage too
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      console.log("localStorage auth state:", parsedAuth);
      if (parsedAuth.isVerified !== auth.isVerified) {
        console.log("Warning: localStorage auth state differs from context state:", parsedAuth);
        // Auto-correct auth state issues if localStorage shows verified but context doesn't
        if (parsedAuth.isVerified && !auth.isVerified) {
          console.log("Auto-correcting auth state inconsistency - localStorage says verified but context doesn't");
          toast.info("Refreshing authentication state...");
          window.location.reload(); // Force reload to fix the state
        }
      }
    }
  }, [auth]);

  if (!auth.isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    // Not authenticated - redirect to login
    return <Navigate to="/login" replace />;
  }

  if (needsVerification && !auth.isVerified) {
    console.log("Not verified, redirecting to verify");
    // Needs to be verified - redirect to OTP verification
    return <Navigate to="/verify" replace />;
  }

  if (needsProfile && auth.needsProfile) {
    console.log("Profile needed, redirecting to create-profile");
    // Needs to complete profile - redirect to profile creation
    return <Navigate to="/create-profile" replace />;
  }
  
  console.log("Authentication checks passed, showing protected content");
  // Authenticated, allow access to protected route
  return <>{children}</>;
};

export default PrivateRoute;
