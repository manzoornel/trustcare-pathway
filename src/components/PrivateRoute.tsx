import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: ReactNode;
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
