
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import { Helmet } from "react-helmet";

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is already authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Admin Login | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Admin panel login for Doctor Uncle Family Clinic. Manage website content, blog posts, and career opportunities."
        />
      </Helmet>
      <AdminLogin />
    </>
  );
};

export default Admin;
