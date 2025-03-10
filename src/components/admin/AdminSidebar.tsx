
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Briefcase, LogOut, Users, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear all admin-related localStorage items
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUsername");
    
    // Show success toast
    toast.success("Logged out successfully");
    
    // Navigate to admin login page
    navigate("/admin");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: UserRound, label: "Doctors", path: "/admin/doctors" },
    { icon: FileText, label: "Blog Posts", path: "/admin/blog" },
    { icon: Briefcase, label: "Careers", path: "/admin/careers" },
    { icon: Users, label: "Staff Applications", path: "/admin/applications" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4 shadow-sm flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-500">Doctor Uncle Family Clinic</p>
      </div>
      
      <nav className="space-y-2 flex-grow">
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
      
      <div className="mt-auto pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
