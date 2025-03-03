
import AdminLayout from "@/components/admin/AdminLayout";
import BlogManagement from "@/components/admin/BlogManagement";
import { Helmet } from "react-helmet";

const BlogManager = () => {
  return (
    <>
      <Helmet>
        <title>Blog Management | Admin Dashboard</title>
      </Helmet>
      <AdminLayout title="Blog Management">
        <BlogManagement />
      </AdminLayout>
    </>
  );
};

export default BlogManager;
