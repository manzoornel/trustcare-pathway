
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type PrivateRouteProps = {
  needsProfile?: boolean;
};

const PrivateRoute = ({ needsProfile = false }: PrivateRouteProps) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    // Not authenticated - redirect to login
    return <Navigate to="/login" replace />;
  }

  if (needsProfile && auth.needsProfile) {
    // Needs to complete profile - redirect to profile creation
    return <Navigate to="/create-profile" replace />;
  }
  
  // Authenticated, allow access to protected route
  return <Outlet />;
};

export default PrivateRoute;
