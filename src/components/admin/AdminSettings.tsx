
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordChange from "./settings/PasswordChange";
import UserManagement from "./settings/UserManagement";
import ThemeManagement from "./settings/ThemeManagement";
import { THEME_CHANGE_EVENT } from '@/contexts/ThemeContext';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("password");

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail && event.detail.theme) {
        console.log('AdminSettings: detected theme change:', event.detail.theme);
      }
    };
    
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="theme">Theme Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password">
          <PasswordChange />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
