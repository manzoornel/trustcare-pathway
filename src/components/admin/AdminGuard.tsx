
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const adminAuthenticated = localStorage.getItem("adminAuthenticated");
      if (adminAuthenticated === "true") {
        setIsAuthenticated(true);
      } else {
        navigate("/admin");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminGuard;
