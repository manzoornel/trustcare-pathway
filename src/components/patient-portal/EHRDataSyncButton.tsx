
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

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
    } catch (error: any) {
      console.error('Error syncing EHR data:', error);
      const errorMessage = error?.message || 'Unknown error during sync';
      setSyncError(errorMessage);
      toast.error(`Failed to sync data: ${errorMessage}`, { id: 'ehr-sync' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleSyncData} 
        disabled={isSyncing || !ehrPatientId}
        className="w-full"
        variant="default"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Synchronizing data...' : 'Sync EHR Data'}
      </Button>
      
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
    </div>
  );
};

export default EHRDataSyncButton;
