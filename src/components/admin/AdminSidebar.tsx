
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Briefcase, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FileText, label: "Blog Posts", path: "/admin/blog" },
    { icon: Briefcase, label: "Careers", path: "/admin/careers" },
    { icon: Users, label: "Staff Applications", path: "/admin/applications" },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-500">Doctor Uncle Family Clinic</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="absolute bottom-4 w-56">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
