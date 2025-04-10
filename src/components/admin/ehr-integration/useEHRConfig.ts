
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EHRConfig = {
  id?: string;
  apiEndpoint: string;
  apiKey: string;
  isActive: boolean;
  lastSyncTime?: string;
};

export const useEHRConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<EHRConfig | null>(null);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('ehr_integration')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine for first-time setup
        console.error('Error fetching EHR config:', error);
        toast.error('Failed to load EHR configuration');
        throw error;
      }
      
      if (data) {
        setConfig({
          id: data.id,
          apiEndpoint: data.api_endpoint,
          apiKey: data.api_key,
          isActive: data.is_active,
          lastSyncTime: data.last_sync_time
        });
      } else {
        // Default config for first-time setup
        setConfig({
          apiEndpoint: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
          apiKey: '',
          isActive: false
        });
      }
    } catch (error) {
      console.error('Error in fetchConfig:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<EHRConfig>) => {
    try {
      if (config?.id) {
        // Update existing config
        const { error } = await supabase
          .from('ehr_integration')
          .update({
            api_endpoint: newConfig.apiEndpoint,
            api_key: newConfig.apiKey,
            is_active: newConfig.isActive
          })
          .eq('id', config.id);
        
        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from('ehr_integration')
          .insert({
            api_endpoint: newConfig.apiEndpoint,
            api_key: newConfig.apiKey,
            is_active: newConfig.isActive
          });
        
        if (error) throw error;
      }
      
      // Update local state
      setConfig(prev => prev ? { ...prev, ...newConfig } : newConfig as EHRConfig);
      return true;
    } catch (error) {
      console.error('Error updating EHR config:', error);
      throw error;
    }
  };

  const testConnection = async (apiEndpoint: string, apiKey: string) => {
    try {
      // Use the ehr-sync edge function to test the connection
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'test',
          config: {
            api_endpoint: apiEndpoint,
            api_key: apiKey
          }
        }
      });
      
      if (error) throw error;
      
      return {
        success: data.success,
        message: data.message || 'Connection successful',
        statusCode: data.statusCode,
        responseBody: data.responseBody
      };
    } catch (error: any) {
      console.error('Error testing EHR connection:', error);
      return {
        success: false,
        message: error.message || 'Connection failed'
      };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    isLoading,
    config,
    fetchConfig,
    updateConfig,
    testConnection
  };
};
