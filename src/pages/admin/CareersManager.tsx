
import AdminLayout from "@/components/admin/AdminLayout";
import CareerManagement from "@/components/admin/CareerManagement";
import { Helmet } from "react-helmet";

const CareersManager = () => {
  return (
    <>
      <Helmet>
        <title>Careers Management | Admin Dashboard</title>
      </Helmet>
      <AdminLayout title="Careers Management">
        <CareerManagement />
      </AdminLayout>
    </>
  );
};

export default CareersManager;
