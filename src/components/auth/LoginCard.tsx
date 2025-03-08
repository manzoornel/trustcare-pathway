
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordLoginForm from "@/components/auth/PasswordLoginForm";
import OTPLoginForm from "@/components/auth/OTPLoginForm";
import { demoPatients } from "@/data/demoPatients";

const LoginCard = () => {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-2">
          Sign in to access your account
        </p>
      </div>

      <Tabs defaultValue="password" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="otp">OTP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password">
          <PasswordLoginForm />
        </TabsContent>
        
        <TabsContent value="otp">
          <OTPLoginForm />
        </TabsContent>
      </Tabs>

      {activeTab === "password" && (
        <div className="mt-6">
          <div className="text-sm text-center mb-2 text-gray-500">
            Demo Accounts (for testing)
          </div>
          <div className="grid gap-2">
            {demoPatients.map((user, index) => (
              <button
                key={index}
                className="py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors text-left"
                onClick={() => {
                  // Handle demo login logic here
                  console.log("Demo login with:", user);
                }}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-500 text-xs">
                  Email: {user.email}, Password: {user.password}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginCard;
