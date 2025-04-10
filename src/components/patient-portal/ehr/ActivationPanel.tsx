
import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/auth';

type ActivationPanelProps = {
  activationError: string | null;
  activationAttempted: boolean;
  onActivate: () => void;
};

const ActivationPanel: React.FC<ActivationPanelProps> = ({
  activationError,
  activationAttempted,
  onActivate
}) => {
  const { auth } = useAuth();

  return (
    <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <p className="text-sm text-amber-700">
            The EHR integration needs to be activated. Simply connect with your phone number below to automatically activate it.
          </p>
          {activationError && (
            <div className="text-sm text-red-600">
              Activation failed: {activationError}
            </div>
          )}
          <Button 
            onClick={onActivate} 
            className="mt-2" 
            variant="secondary" 
            size="sm"
          >
            {activationAttempted ? "Retry Activation" : "Activate Now"}
          </Button>
          {auth.role === 'admin' && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/settings" className="inline-flex items-center">
                <span>Go to Admin Settings</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationPanel;
