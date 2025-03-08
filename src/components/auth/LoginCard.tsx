
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordLoginForm from './PasswordLoginForm';
import OTPLoginForm from './OTPLoginForm';
import { demoPatients } from '@/data/demoPatients';

const LoginCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Login to access your health information and services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP Login</TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <PasswordLoginForm />
          </TabsContent>
          <TabsContent value="otp">
            <OTPLoginForm authenticatedUsers={demoPatients} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
