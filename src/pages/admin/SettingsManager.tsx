
import React, { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSettings from "@/components/admin/AdminSettings";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const SettingsManager = () => {
  const navigate = useNavigate();
  
  // Ensure user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Admin Settings | Doctor Uncle Family Clinic</title>
      </Helmet>
      <AdminLayout title="Settings" requiredRole="admin">
        <AdminSettings />
      </AdminLayout>
    </>
  );
};

export default SettingsManager;
