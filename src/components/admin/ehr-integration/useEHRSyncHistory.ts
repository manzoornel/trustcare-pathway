
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EHRSyncHistory } from './types';
import { toast } from "sonner";

export const useEHRSyncHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [syncHistory, setSyncHistory] = useState<EHRSyncHistory[]>([]);

  const fetchSyncHistory = async () => {
    try {
      setIsLoading(true);
      
      // Get sync history from the ehr_sync_history table
      const { data, error } = await supabase
        .from('ehr_sync_history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Ensure data is correctly typed
      const typedData: EHRSyncHistory[] = data ? data.map(record => ({
        id: record.id,
        timestamp: record.timestamp,
        status: record.status as 'success' | 'failed' | 'in_progress',
        message: record.message,
        patient_id: record.patient_id || undefined,
        details: record.details || undefined
      })) : [];
      
      setSyncHistory(typedData);
    } catch (error) {
      console.error('Error fetching EHR sync history:', error);
      toast.error('Failed to load sync history');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualSync = async (patientId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'sync',
          patientId: patientId || null 
        }
      });
      
      if (error) throw error;
      
      toast.success('Sync initiated successfully');
      fetchSyncHistory(); // Refresh history after triggering sync
      
      return data;
    } catch (error) {
      console.error('Error triggering manual sync:', error);
      toast.error('Failed to initiate sync');
      return { success: false, message: error.message || 'Unknown error occurred' };
    }
  };

  useEffect(() => {
    fetchSyncHistory();
    
    // Set up a polling interval to refresh sync history
    const intervalId = setInterval(() => {
      fetchSyncHistory();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    syncHistory,
    isLoading,
    refreshHistory: fetchSyncHistory,
    triggerManualSync
  };
};
