
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from "./EmailLoginForm";
import PhoneLoginForm from "./PhoneLoginForm";
import DemoAccountsSection from "./DemoAccountsSection";

interface LoginTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  handleEmailLogin: (e: React.FormEvent) => Promise<void>;
  handlePhoneLogin: (e: React.FormEvent) => Promise<void>;
  loginWithDemoAccount: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const LoginTabs = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
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
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleEmailLogin={handleEmailLogin}
          error={error}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneLoginForm
          phone={phone}
          setPhone={setPhone}
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
