
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationsManagement from "@/components/admin/ApplicationsManagement";
import { Helmet } from "react-helmet";

const ApplicationsManager = () => {
  return (
    <>
      <Helmet>
        <title>Applications Management | Admin Dashboard</title>
      </Helmet>
      <AdminLayout title="Job Applications">
        <ApplicationsManagement />
      </AdminLayout>
    </>
  );
};

export default ApplicationsManager;
