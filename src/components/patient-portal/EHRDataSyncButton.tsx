
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface EHRDataSyncButtonProps {
  onSyncComplete?: () => void;
  ehrPatientId?: string;
}

const EHRDataSyncButton: React.FC<EHRDataSyncButtonProps> = ({ 
  onSyncComplete, 
  ehrPatientId 
}) => {
  const { auth } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncData = async () => {
    if (!auth.userId) {
      toast.error('You must be logged in to sync data');
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'sync',
          patientId: auth.userId,
          patientEhrId: ehrPatientId
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Sync failed');
      }
      
      toast.success('Successfully synchronized data from EHR');
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error: any) {
      console.error('Error syncing EHR data:', error);
      toast.error(`Failed to sync data: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSyncData} 
      disabled={isSyncing}
      className="w-full"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Synchronizing data...' : 'Sync EHR Data'}
    </Button>
  );
};

export default EHRDataSyncButton;
