
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
      
      // Check if there's already a config
      const { data: existingConfig, error: configError } = await supabase
        .from('ehr_integration')
        .select('id')
        .limit(1);
        
      if (configError) {
        console.error('Error checking existing EHR config:', configError);
        throw new Error('Failed to check existing configuration');
      }
      
      console.log('Existing config check result:', existingConfig);
      
      let result;
      if (existingConfig && existingConfig.length > 0) {
        // Update existing config
        console.log('Updating existing EHR config with ID:', existingConfig[0].id);
        
        const { error: updateError } = await supabase
          .from('ehr_integration')
          .update({ is_active: true })
          .eq('id', existingConfig[0].id);
          
        if (updateError) {
          console.error('Error updating EHR config:', updateError);
          throw new Error('Failed to update configuration');
        }
        
        result = { success: true };
      } else {
        // Create new config with default values
        console.log('Creating new EHR config');
        
        const { data, error: insertError } = await supabase
          .from('ehr_integration')
          .insert({
            api_endpoint: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
            api_key: 'default-key', 
            is_active: true
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating EHR config:', insertError);
          throw new Error('Failed to create configuration');
        }
        
        console.log('New EHR config created:', data);
        result = { success: true, data };
      }
      
      if (result.success) {
        setEhrActive(true);
        toast.success('EHR integration successfully activated');
        
        // Refresh config after activation
        await checkEhrConfig();
      } else {
        throw new Error('Unknown error during activation');
      }
    } catch (error: any) {
      console.error('Error activating EHR integration:', error);
      setActivationError(error.message || 'Failed to activate EHR integration');
      toast.error('Failed to activate EHR integration: ' + (error.message || 'Unknown error'));
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
        }
      } catch (updateErr) {
        console.error('Error in hospital_id update:', updateErr);
      }
    }
    
    toast.success('Successfully connected to EHR system');
    
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
