
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from '@/components/login/EmailLoginForm';
import OTPLoginForm from '@/components/login/PhoneLoginForm';
import { Link } from 'react-router-dom';
import DemoAccountsSection from '@/components/login/DemoAccountsSection';
import { demoPatients } from '@/data/demoPatients';

type LoginCardProps = {
  onSubmit?: (email: string, password: string) => void;
  onOTPSubmit?: (phone: string) => void;
  loading?: boolean;
};

const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  onOTPSubmit,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>("email");

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
            <EmailLoginForm onSubmit={onSubmit} loading={loading} />
          </TabsContent>
          <TabsContent value="phone">
            <OTPLoginForm onSubmit={onOTPSubmit} loading={loading} />
          </TabsContent>
        </Tabs>

        <DemoAccountsSection demoAccounts={demoPatients} />
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
