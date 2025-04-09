
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordChange from "./settings/PasswordChange";
import UserManagement from "./settings/UserManagement";
import ThemeManagement from "./settings/ThemeManagement";
import EHRIntegrationSettings from "./EHRIntegrationSettings";
import { THEME_CHANGE_EVENT } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [ehrConfigured, setEhrConfigured] = useState(false);

  // Check EHR configuration status
  useEffect(() => {
    const checkEhrConfig = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase
          .from('ehr_integration')
          .select('is_active')
          .eq('is_active', true)
          .limit(1);
          
        setEhrConfigured(data && data.length > 0);
      } catch (error) {
        console.error('Error checking EHR configuration:', error);
      }
    };
    
    checkEhrConfig();
  }, [activeTab]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const event = e as CustomEvent<{theme: string}>;
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
          <TabsTrigger value="ehr" className="relative">
            EHR Integration
            {ehrConfigured && (
              <Badge className="ml-2 bg-green-500 text-white">Active</Badge>
            )}
          </TabsTrigger>
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
        
        <TabsContent value="ehr">
          <EHRIntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
