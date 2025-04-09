
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EHRConfig, TestResult } from './types';

export const useEHRConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult>(null);
  const [ehrConfig, setEhrConfig] = useState<EHRConfig>({
    id: '',
    api_endpoint: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
    api_key: '',
    is_active: false,
    last_sync_time: null
  });

  const fetchEHRConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ehr_integration')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setEhrConfig(data[0]);
      }
    } catch (error) {
      console.error('Error fetching EHR configuration:', error);
      toast.error('Failed to load EHR configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      
      // Validation
      if (!ehrConfig.api_endpoint || !ehrConfig.api_key) {
        toast.error('API Endpoint and API Key are required');
        return;
      }
      
      // Save to database
      let response;
      
      if (ehrConfig.id) {
        // Update existing config
        response = await supabase
          .from('ehr_integration')
          .update({
            api_endpoint: ehrConfig.api_endpoint,
            api_key: ehrConfig.api_key,
            is_active: ehrConfig.is_active
          })
          .eq('id', ehrConfig.id);
      } else {
        // Insert new config
        response = await supabase
          .from('ehr_integration')
          .insert({
            api_endpoint: ehrConfig.api_endpoint,
            api_key: ehrConfig.api_key,
            is_active: ehrConfig.is_active
          })
          .select();
        
        if (response.data && response.data.length > 0) {
          setEhrConfig({...ehrConfig, id: response.data[0].id});
        }
      }
      
      if (response.error) throw response.error;
      
      toast.success('EHR configuration saved successfully');
    } catch (error) {
      console.error('Error saving EHR configuration:', error);
      toast.error('Failed to save EHR configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);
      
      // Call the ehr-test edge function
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'test',
          config: {
            api_endpoint: ehrConfig.api_endpoint,
            api_key: ehrConfig.api_key
          }
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setTestResult({
          success: true,
          message: 'Connection successful! API responded correctly.'
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'Connection failed. Please check your API credentials.'
        });
      }
    } catch (error) {
      console.error('Error testing EHR connection:', error);
      setTestResult({
        success: false,
        message: 'Connection test failed: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    fetchEHRConfig();
  }, []);

  return {
    ehrConfig,
    setEhrConfig,
    isLoading,
    isSaving,
    isTesting,
    testResult,
    handleSaveConfig,
    handleTestConnection
  };
};
