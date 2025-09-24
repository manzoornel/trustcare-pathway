
import React, { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

type PrivateRouteProps = {
  children: ReactNode;
  needsProfile?: boolean;
  needsVerification?: boolean;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found in localStorage, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Token found, rendering protected content");
  return <>{children}</>;
};

export default PrivateRoute;
