
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

  // Direct activation method using RPC functions
  const activateWithRPC = async () => {
    try {
      console.log('Attempting direct activation using RPC functions');
      
      // First check if there's an existing config
      const { data: existingConfig, error: configError } = await supabase
        .from('ehr_integration')
        .select('id')
        .limit(1);
        
      if (configError) {
        console.error('Error checking existing config:', configError);
        throw new Error(`Failed to check existing configuration: ${configError.message}`);
      }
      
      if (existingConfig && existingConfig.length > 0) {
        // Update existing config using RPC
        console.log('Updating existing EHR config with ID:', existingConfig[0].id);
        
        const { data, error: updateError } = await supabase.rpc('activate_ehr_integration', {
          config_id: existingConfig[0].id,
          user_id: auth.userId
        });
          
        if (updateError) {
          console.error('Error updating EHR config with RPC:', updateError);
          throw new Error(`RPC activation failed: ${updateError.message}`);
        }
      } else {
        // Create new config with RPC
        console.log('Creating new EHR config with RPC');
        
        const { data, error: createError } = await supabase.rpc('create_ehr_integration', {
          api_endpoint_param: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
          api_key_param: 'default-key',
          user_id: auth.userId
        });
          
        if (createError) {
          console.error('Error creating EHR config with RPC:', createError);
          throw new Error(`RPC creation failed: ${createError.message}`);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error in direct RPC activation:', error);
      throw error;
    }
  };

  const activateEHRIntegration = async () => {
    if (isActivating) return;
    
    setIsActivating(true);
    setActivationError(null);
    setActivationAttempted(true);
    
    try {
      console.log('Activating EHR integration');
      
      let activationResult;
      
      // First try using the edge function
      try {
        console.log('Attempting to activate via edge function');
        const response = await supabase.functions.invoke(
          'ehr-sync',
          {
            body: {
              action: 'activateEHRIntegration',
              userId: auth.userId
            }
          }
        );
        
        if (response.error) {
          console.error('Edge function error:', response.error);
          throw new Error(response.error.message || 'Edge function error');
        }
        
        activationResult = response.data;
      } catch (edgeFunctionError: any) {
        console.warn('Edge function failed, falling back to RPC:', edgeFunctionError);
        // If edge function fails, try direct RPC activation
        activationResult = await activateWithRPC();
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
      } else if (error.message?.includes("Failed to send a request to the Edge Function")) {
        errorMessage = "Connection to backend failed. Please try again or contact support.";
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
