
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordLoginForm from "./PasswordLoginForm";
import OTPLoginForm from "./OTPLoginForm";

interface LoginCardProps {
  authenticatedUsers: Array<{
    hospitalId: string;
    phone: string;
    email: string;
    name: string;
    password: string;
  }>;
}

const LoginCard: React.FC<LoginCardProps> = ({ authenticatedUsers }) => {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Authentication</CardTitle>
        <CardDescription>
          Log in with your hospital ID, phone number, or email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="password" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <PasswordLoginForm authenticatedUsers={authenticatedUsers} />
          </TabsContent>
          
          <TabsContent value="otp">
            <OTPLoginForm authenticatedUsers={authenticatedUsers} />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
