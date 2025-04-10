
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';

export const useEHRIntegration = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [ehrPatientId, setEhrPatientId] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [ehrActive, setEhrActive] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [activationAttempted, setActivationAttempted] = useState(false);

  // Check if EHR integration is active
  useEffect(() => {
    checkEhrConfig();
  }, []);

  // Fetch EHR connection status
  useEffect(() => {
    if (auth.userId) {
      fetchEhrConnection();
    }
  }, [auth.userId]);

  const checkEhrConfig = async () => {
    try {
      console.log('Checking EHR integration status');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('ehr_integration')
        .select('is_active')
        .eq('is_active', true)
        .limit(1);
        
      if (error) {
        console.error('Error checking EHR integration status:', error);
        toast.error('Error checking EHR integration status');
        return;
      }
      
      console.log('EHR integration status response:', data);
      setEhrActive(data && data.length > 0);
    } catch (error) {
      console.error('Error in checkEhrConfig:', error);
      toast.error('Failed to check EHR configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEhrConnection = async () => {
    if (!auth.userId) {
      console.log('No user ID available, skipping fetchEhrConnection');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching EHR connection for user:', auth.userId);
      
      // Get the patient's EHR ID
      const { data: profile, error: profileError } = await supabase
        .from('patient_profiles')
        .select('hospital_id')
        .eq('id', auth.userId)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error fetching patient profile:', profileError);
      } else {
        console.log('Patient profile data:', profile);
        if (profile) {
          setEhrPatientId(profile.hospital_id);
        }
      }
      
      // Get last sync time
      const { data: syncHistory, error: syncError } = await supabase
        .from('ehr_sync_history')
        .select('timestamp')
        .eq('patient_id', auth.userId)
        .eq('status', 'success')
        .order('timestamp', { ascending: false })
        .limit(1);
        
      if (syncError) {
        console.error('Error fetching sync history:', syncError);
      } else {
        console.log('Sync history data:', syncHistory);
        if (syncHistory && syncHistory.length > 0) {
          setLastSyncTime(syncHistory[0].timestamp);
        }
      }
    } catch (error) {
      console.error('Error in fetchEhrConnection:', error);
      toast.error('Failed to fetch EHR connection status');
    } finally {
      setIsLoading(false);
    }
  };

  const activateEHRIntegration = async () => {
    if (isActivating) return;
    
    setIsActivating(true);
    setActivationError(null);
    setActivationAttempted(true);
    
    try {
      console.log('Activating EHR integration');
      
      // Call the edge function to activate EHR integration securely
      const { data: activationResult, error: activationError } = await supabase.functions.invoke(
        'ehr-sync',
        {
          body: {
            action: 'activateEHRIntegration',
            userId: auth.userId
          }
        }
      );
      
      if (activationError) {
        console.error('Error invoking activation function:', activationError);
        throw new Error(activationError.message || 'Failed to activate EHR integration');
      }
      
      if (!activationResult?.success) {
        throw new Error(activationResult?.message || 'Unknown error during activation');
      }
      
      setEhrActive(true);
      toast.success('EHR integration successfully activated');
      
      // Refresh config after activation
      await checkEhrConfig();
      await fetchEhrConnection();
    } catch (error: any) {
      console.error('Error activating EHR integration:', error);
      
      // Provide a more user-friendly error message
      let errorMessage = "Failed to activate EHR integration";
      
      if (error.message?.includes("violates row-level security policy")) {
        errorMessage = "Permission denied. Please contact an administrator to activate EHR integration.";
      } else if (error.message?.includes("function") && error.message?.includes("does not exist")) {
        errorMessage = "System setup incomplete. Please contact an administrator.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setActivationError(errorMessage);
      toast.error(errorMessage);
      setEhrActive(false);
    } finally {
      setIsActivating(false);
    }
  };

  const handleLoginSuccess = async (patientId: string) => {
    setEhrPatientId(patientId);
    
    // If EHR integration isn't active, automatically activate it
    if (!ehrActive) {
      await activateEHRIntegration();
    }
    
    // Update user's hospital_id if needed
    if (auth.userId && patientId) {
      try {
        const { error: updateError } = await supabase
          .from('patient_profiles')
          .update({ hospital_id: patientId })
          .eq('id', auth.userId);
          
        if (updateError) {
          console.error('Error updating hospital_id:', updateError);
          toast.error('Failed to update patient profile');
        } else {
          toast.success('Successfully connected to EHR system');
        }
      } catch (updateErr) {
        console.error('Error in hospital_id update:', updateErr);
        toast.error('Failed to update patient profile');
      }
    }
    
    // Refresh connection status
    await fetchEhrConnection();
  };
  
  const handleSyncComplete = () => {
    setLastSyncTime(new Date().toISOString());
    toast.success('Successfully synced data from EHR');
    fetchEhrConnection();
  };

  return {
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
    refreshConnection: fetchEhrConnection
  };
};
