
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { demoPatients } from "@/data/demoPatients";

interface DemoAccountsSectionProps {
  loginWithDemoAccount: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const DemoAccountsSection = ({ loginWithDemoAccount, loading }: DemoAccountsSectionProps) => {
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">For testing purposes:</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDemoAccounts(!showDemoAccounts)}
          className="flex items-center gap-1"
        >
          <Info className="h-4 w-4" />
          {showDemoAccounts ? "Hide Demo Accounts" : "Show Demo Accounts"}
        </Button>
      </div>
      
      {showDemoAccounts && (
        <div className="mt-2 border rounded-md p-3 bg-gray-50">
          <p className="text-sm font-medium mb-2">Quick Login with Demo Accounts:</p>
          <div className="space-y-2">
            {demoPatients.map((patient, index) => (
              <div key={index} className="border rounded-md p-2 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">Hospital ID: {patient.hospitalId}</p>
                    <p className="text-xs text-gray-500">Email: {patient.email}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => loginWithDemoAccount(patient.email, patient.password)}
                    disabled={loading}
                  >
                    Login
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoAccountsSection;
