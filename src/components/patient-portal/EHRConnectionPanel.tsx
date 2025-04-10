
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useEHRIntegration } from '@/hooks/useEHRIntegration';
import ConnectionStatus from './ehr/ConnectionStatus';
import SyncStatus from './ehr/SyncStatus';
import ActivationPanel from './ehr/ActivationPanel';
import LoginSection from './ehr/LoginSection';

const EHRConnectionPanel = () => {
  const {
    isLoading,
    ehrPatientId,
    lastSyncTime,
    ehrActive,
    isActivating,
    activationError,
    activationAttempted,
    activateEHRIntegration,
    handleLoginSuccess,
    handleSyncComplete,
    refreshConnection
  } = useEHRIntegration();

  return (
    <Card>
      <CardHeader>
        <CardTitle>EHR Connection</CardTitle>
        <CardDescription>
          Connect and sync your medical records from the hospital's EHR system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-gray-50">
          <ConnectionStatus
            isLoading={isLoading}
            isActivating={isActivating}
            ehrActive={ehrActive}
            ehrPatientId={ehrPatientId}
          />
          <SyncStatus
            ehrActive={ehrActive}
            ehrPatientId={ehrPatientId}
            lastSyncTime={lastSyncTime}
            onRefresh={refreshConnection}
          />
        </div>
        
        {!ehrActive && !isActivating ? (
          <ActivationPanel
            activationError={activationError}
            activationAttempted={activationAttempted}
            isActivating={isActivating}
            onActivate={activateEHRIntegration}
          />
        ) : (
          <LoginSection
            ehrPatientId={ehrPatientId}
            onLoginSuccess={handleLoginSuccess}
            onSyncComplete={handleSyncComplete}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-start border-t pt-4">
        <div className="text-xs text-gray-500">
          Your health records are synchronized securely from the hospital's EHR system.
          {activationError && (
            <strong className="block mt-1">
              If you're having trouble connecting, please contact hospital support.
            </strong>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EHRConnectionPanel;
