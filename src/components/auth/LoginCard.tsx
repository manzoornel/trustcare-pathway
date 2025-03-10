
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from '@/components/login/EmailLoginForm';
import PhoneLoginForm from '@/components/login/PhoneLoginForm';
import { Link } from 'react-router-dom';
import DemoAccountsSection from '@/components/login/DemoAccountsSection';
import { demoPatients } from '@/data/demoPatients';

type LoginCardProps = {
  onEmailLogin?: (values: { email: string; password: string }) => Promise<void>;
  onPhoneLogin?: (values: { phone: string }) => Promise<void>;
  onDemoLogin?: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

const LoginCard: React.FC<LoginCardProps> = ({
  onEmailLogin,
  onPhoneLogin,
  onDemoLogin,
  loading = false,
  error = null,
}) => {
  const [activeTab, setActiveTab] = useState<string>("email");

  const handleEmailLogin = async (values: { email: string; password: string }) => {
    if (onEmailLogin) {
      await onEmailLogin(values);
    }
  };

  const handlePhoneLogin = async (values: { phone: string }) => {
    if (onPhoneLogin) {
      await onPhoneLogin(values);
    }
  };

  const loginWithDemoAccount = async (email: string, password: string) => {
    if (onDemoLogin) {
      await onDemoLogin(email, password);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Login to your account to access your medical records and appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <EmailLoginForm 
              handleEmailLogin={handleEmailLogin} 
              loading={loading}
              error={error}
            />
          </TabsContent>
          <TabsContent value="phone">
            <PhoneLoginForm 
              handlePhoneLogin={handlePhoneLogin} 
              loading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>

        <DemoAccountsSection 
          loginWithDemoAccount={loginWithDemoAccount}
          loading={loading}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
