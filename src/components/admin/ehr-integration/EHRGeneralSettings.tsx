
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEHRConfig } from './useEHRConfig';
import EHRTestResult from './EHRTestResult';

const EHRGeneralSettings = () => {
  const { config, isLoading, updateConfig, testConnection } = useEHRConfig();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | { success: boolean; message: string }>(null);

  // Initialize form with config data
  useEffect(() => {
    if (config) {
      setApiEndpoint(config.apiEndpoint || 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public');
      setApiKey(config.apiKey || '');
      setIsActive(config.isActive || false);
    }
  }, [config]);

  const handleSaveSettings = async () => {
    try {
      await updateConfig({
        apiEndpoint,
        apiKey,
        isActive
      });
      toast.success('EHR configuration saved successfully');
    } catch (error) {
      console.error('Failed to save EHR configuration:', error);
      toast.error('Failed to save configuration');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testConnection(apiEndpoint, apiKey);
      setTestResult(result);
      
      if (result.success) {
        toast.success('Connection test successful');
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Unknown error occurred'
      });
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connection Settings</h3>
        <p className="text-sm text-gray-500 mt-1">
          Configure the connection to your Electronic Health Record system
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="api-endpoint">API Endpoint URL</Label>
          <Input 
            id="api-endpoint"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.ehr-provider.com/v1"
          />
          <p className="text-xs text-gray-500">
            The base URL for the EHR API (example: http://103.99.205.192:8008/mirrors/Dr_Mirror/public)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input 
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your EHR API key"
          />
          <p className="text-xs text-gray-500">
            The API key provided by your EHR system (used in the 'token' header)
          </p>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="active">Enable EHR Integration</Label>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <Button onClick={handleTestConnection} disabled={isTesting} variant="outline">
          {isTesting ? 'Testing...' : 'Test Connection'}
        </Button>
        
        {testResult && (
          <EHRTestResult result={testResult} />
        )}
        
        <Button onClick={handleSaveSettings} className="mt-4">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default EHRGeneralSettings;
