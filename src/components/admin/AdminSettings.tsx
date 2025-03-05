
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordChange from "./settings/PasswordChange";
import UserManagement from "./settings/UserManagement";
import ThemeManagement from "./settings/ThemeManagement";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("password");

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
