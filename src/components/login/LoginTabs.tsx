
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import PhoneLoginForm from "./PhoneLoginForm";
import DemoAccountsSection from "./DemoAccountsSection";

interface LoginTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleEmailLogin: (values: { email: string; password: string }) => Promise<void>;
  handlePhoneLogin: (values: { phone: string }) => Promise<void>;
  loginWithDemoAccount: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const LoginTabs = ({
  activeTab,
  setActiveTab,
  handleEmailLogin,
  handlePhoneLogin,
  loginWithDemoAccount,
  error,
  loading
}: LoginTabsProps) => {
  return (
    <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="phone">Phone</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        <EmailLoginForm 
          handleEmailLogin={handleEmailLogin}
          error={error}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneLoginForm
          handlePhoneLogin={handlePhoneLogin}
          error={error}
          loading={loading}
        />
      </TabsContent>

      <DemoAccountsSection 
        loginWithDemoAccount={loginWithDemoAccount}
        loading={loading}
      />
    </Tabs>
  );
};

export default LoginTabs;
