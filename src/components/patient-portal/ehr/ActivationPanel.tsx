
import React from 'react';
import { AlertCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/auth';

type ActivationPanelProps = {
  activationError: string | null;
  activationAttempted: boolean;
  isActivating: boolean;
  onActivate: () => void;
};

const ActivationPanel: React.FC<ActivationPanelProps> = ({
  activationError,
  activationAttempted,
  isActivating,
  onActivate
}) => {
  const { auth } = useAuth();

  return (
    <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="space-y-2 w-full">
          <p className="text-sm text-amber-700">
            {activationError && activationError.includes("Connection to backend failed") 
              ? "We're having trouble connecting to our servers. Please try activating again."
              : "The EHR integration needs to be activated. Click the button below to activate it."}
          </p>
          
          {activationError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
              <strong>Activation failed:</strong> {activationError}
              {activationError.includes("Connection to backend failed") && (
                <div className="mt-1 text-xs">
                  This could be due to a temporary network issue or server maintenance.
                </div>
              )}
            </div>
          )}
          
          {activationAttempted && !activationError && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-100">
              Activation was successful! You can now connect to the EHR system.
            </div>
          )}
          
          <div className="pt-2 flex flex-wrap gap-2">
            <Button 
              onClick={onActivate} 
              className="w-full md:w-auto" 
              variant={activationError?.includes("Connection to backend failed") ? "secondary" : "default"}
              size="sm"
              disabled={isActivating}
            >
              {isActivating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : activationError?.includes("Connection to backend failed") ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Connection
                </>
              ) : (
                activationAttempted ? "Retry Activation" : "Activate Now"
              )}
            </Button>
          </div>
          
          {auth.role === 'admin' && (
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/settings" className="inline-flex items-center">
                  <span>Go to Admin Settings</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationPanel;
