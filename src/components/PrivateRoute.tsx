
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

  // For debugging
  console.log("Auth state in PrivateRoute:", auth);

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
