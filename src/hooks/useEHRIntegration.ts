
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
      const { data, error } = await supabase
        .from('ehr_integration')
        .select('is_active')
        .eq('is_active', true)
        .limit(1);
        
      if (error) {
        console.error('Error checking EHR integration status:', error);
        return;
      }
      
      console.log('EHR integration status:', data);
      setEhrActive(data && data.length > 0);
    } catch (error) {
      console.error('Error checking EHR configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEhrConnection = async () => {
    setIsLoading(true);
    try {
      // Get the patient's EHR ID
      const { data: profile, error: profileError } = await supabase
        .from('patient_profiles')
        .select('hospital_id')
        .eq('id', auth.userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching patient profile:', profileError);
      } else if (profile) {
        setEhrPatientId(profile.hospital_id);
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
      } else if (syncHistory && syncHistory.length > 0) {
        setLastSyncTime(syncHistory[0].timestamp);
      }
    } catch (error) {
      console.error('Error fetching EHR connection status:', error);
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
      
      console.log('Existing config:', existingConfig);
      
      if (existingConfig && existingConfig.length > 0) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('ehr_integration')
          .update({ is_active: true })
          .eq('id', existingConfig[0].id);
          
        if (updateError) {
          console.error('Error updating EHR config:', updateError);
          throw new Error('Failed to update configuration');
        }
      } else {
        // Create new config with default values
        const { error: insertError } = await supabase
          .from('ehr_integration')
          .insert({
            api_endpoint: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
            api_key: 'default-key', 
            is_active: true
          });
          
        if (insertError) {
          console.error('Error creating EHR config:', insertError);
          throw new Error('Failed to create configuration');
        }
      }
      
      setEhrActive(true);
      toast.success('EHR integration successfully activated');
    } catch (error: any) {
      console.error('Error activating EHR integration:', error);
      setActivationError(error.message || 'Failed to activate EHR integration');
      toast.error('Failed to activate EHR integration');
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
    
    toast.success('Successfully connected to EHR system');
  };
  
  const handleSyncComplete = () => {
    setLastSyncTime(new Date().toISOString());
    toast.success('Successfully synced data from EHR');
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
    handleSyncComplete
  };
};
