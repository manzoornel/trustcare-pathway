
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSettings from "@/components/admin/AdminSettings";
import { Helmet } from "react-helmet";

const SettingsManager = () => {
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
