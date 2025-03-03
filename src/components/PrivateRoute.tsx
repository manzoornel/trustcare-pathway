
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

  if (!auth.isAuthenticated) {
    // Not authenticated - redirect to login
    return <Navigate to="/login" replace />;
  }

  if (needsVerification && !auth.isVerified) {
    // Needs to be verified - redirect to OTP verification
    return <Navigate to="/verify" replace />;
  }

  if (needsProfile && auth.needsProfile) {
    // Needs to complete profile - redirect to profile creation
    return <Navigate to="/create-profile" replace />;
  }
  
  // Authenticated, allow access to protected route
  return <>{children}</>;
};

export default PrivateRoute;
