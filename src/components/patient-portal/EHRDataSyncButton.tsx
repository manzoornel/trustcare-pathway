
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EHRDataSyncButtonProps {
  onSyncComplete?: () => void;
  ehrPatientId?: string | null;
}

const EHRDataSyncButton: React.FC<EHRDataSyncButtonProps> = ({ 
  onSyncComplete, 
  ehrPatientId 
}) => {
  const { auth } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    ehrActive: boolean;
    configExists: boolean;
    apiEndpoint?: string;
  } | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check actual EHR connection status directly from database
  const checkConnectionStatus = async () => {
    setIsCheckingStatus(true);
    try {
      // Check if EHR integration exists and is active
      const { data: ehrConfig, error: configError } = await supabase
        .from('ehr_integration')
        .select('is_active, api_endpoint')
        .limit(1);
        
      if (configError) {
        console.error('Error checking EHR config:', configError);
        throw new Error(`Failed to check EHR configuration: ${configError.message}`);
      }
      
      setConnectionStatus({
        configExists: ehrConfig && ehrConfig.length > 0,
        ehrActive: ehrConfig && ehrConfig.length > 0 && ehrConfig[0].is_active,
        apiEndpoint: ehrConfig && ehrConfig.length > 0 ? ehrConfig[0].api_endpoint : undefined
      });
      
    } catch (error: any) {
      console.error('Error checking connection status:', error);
      toast.error('Failed to check EHR connection status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const handleSyncData = async () => {
    if (!auth.userId) {
      toast.error('You must be logged in to sync data');
      return;
    }

    setSyncError(null);
    setIsSyncing(true);
    
    try {
      console.log('Syncing EHR data', { patientId: auth.userId, patientEhrId: ehrPatientId });
      
      // Show a toast that we're syncing data (this will be replaced by the success/error toast)
      toast.loading('Synchronizing with EHR system...', { id: 'ehr-sync' });
      
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'sync',
          patientId: auth.userId,
          patientEhrId: ehrPatientId
        }
      });
      
      console.log('Sync response:', data, error);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.success) {
        throw new Error(data?.message || 'Sync failed');
      }
      
      // Check if we got mock data or real data
      if (data.data?._meta?.usingMockData) {
        toast.warning('Could not connect to EHR system - using demo data', { id: 'ehr-sync' });
      } else {
        toast.success('Successfully synchronized data from EHR', { id: 'ehr-sync' });
      }
      
      if (onSyncComplete) {
        onSyncComplete();
      }
      
      // Refresh connection status after sync
      checkConnectionStatus();
    } catch (error: any) {
      console.error('Error syncing EHR data:', error);
      const errorMessage = error?.message || 'Unknown error during sync';
      setSyncError(errorMessage);
      toast.error(`Failed to sync data: ${errorMessage}`, { id: 'ehr-sync' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    if (!connectionStatus?.apiEndpoint) {
      toast.error('No API endpoint configured');
      return;
    }

    setIsSyncing(true);
    try {
      toast.loading('Testing EHR connection...', { id: 'ehr-test' });

      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'test',
          config: {
            api_endpoint: connectionStatus.apiEndpoint,
            api_key: 'default-key' // We don't send the actual key for security
          }
        }
      });
      
      console.log('Connection test response:', data, error);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.success) {
        toast.success('EHR connection test passed', { id: 'ehr-test' });
      } else {
        toast.error(`Connection test failed: ${data.message}`, { id: 'ehr-test' });
      }
    } catch (error: any) {
      console.error('Error testing connection:', error);
      toast.error(`Test failed: ${error.message}`, { id: 'ehr-test' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-3">
      {isCheckingStatus ? (
        <div className="p-2 text-center">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Checking connection status...</p>
        </div>
      ) : connectionStatus && !connectionStatus.ehrActive && (
        <Alert variant="warning" className="mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Backend EHR integration is not active. The database shows the integration is disabled or missing.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSyncData} 
        disabled={isSyncing || !ehrPatientId}
        className="w-full"
        variant="default"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Synchronizing data...' : 'Sync EHR Data'}
      </Button>
      
      {connectionStatus && (
        <Button
          onClick={handleTestConnection}
          disabled={isSyncing || !connectionStatus.apiEndpoint}
          className="w-full"
          variant="outline"
          size="sm"
        >
          Test EHR Connection
        </Button>
      )}
      
      {syncError && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{syncError}</span>
        </div>
      )}
      
      {!ehrPatientId && (
        <p className="text-xs text-amber-600">
          You need to connect to your EHR system first before synchronizing data.
        </p>
      )}
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="diagnostics">
          <AccordionTrigger className="text-xs text-gray-500 hover:text-gray-700">
            EHR Connection Diagnostics
          </AccordionTrigger>
          <AccordionContent className="text-xs space-y-1 bg-gray-50 p-2 rounded-md">
            <p><strong>EHR Patient ID:</strong> {ehrPatientId || 'Not connected'}</p>
            <p><strong>Config exists:</strong> {connectionStatus?.configExists ? 'Yes' : 'No'}</p>
            <p><strong>Integration active:</strong> {connectionStatus?.ehrActive ? 'Yes' : 'No'}</p>
            <p><strong>API Endpoint:</strong> {connectionStatus?.apiEndpoint || 'Not configured'}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EHRDataSyncButton;
