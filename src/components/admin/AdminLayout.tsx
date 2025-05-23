
import AdminSidebar from "./AdminSidebar";
import AdminGuard from "./AdminGuard";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  requiredRole?: "admin" | "manager" | "staff";
}

const AdminLayout = ({ children, title, requiredRole }: AdminLayoutProps) => {
  return (
    <AdminGuard requiredRole={requiredRole}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
