
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEHRConfig } from './useEHRConfig';
import EHRTestResult from './EHRTestResult';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, XCircle } from "lucide-react";

const EHRGeneralSettings = () => {
  const { config, isLoading, updateConfig, testConnection } = useEHRConfig();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | { 
    success: boolean; 
    message: string;
    statusCode?: number;
    responseBody?: string;
    endpoints?: {
      health?: {
        status: string;
        responseBody?: string;
      };
      getLoginOTP?: {
        status: string;
        responseBody?: string;
      };
    };
  }>(null);

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
      
      {!apiEndpoint && (
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Endpoint Missing</AlertTitle>
          <AlertDescription>
            Please enter the API endpoint URL of your EHR system.
          </AlertDescription>
        </Alert>
      )}
      
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
        <Button 
          onClick={handleTestConnection} 
          disabled={isTesting || !apiEndpoint || !apiKey} 
          variant="outline"
          className="flex items-center gap-2"
        >
          {isTesting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Testing...
            </>
          ) : (
            <>
              {testResult?.success ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : testResult ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : null}
              Test Connection
            </>
          )}
        </Button>
        
        {testResult && (
          <div className="border rounded-md p-4 mt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              {testResult.success ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-700">Connection Successful</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">Connection Failed</span>
                </>
              )}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{testResult.message}</p>
            
            {testResult.statusCode && (
              <p className="text-xs text-gray-500">Status Code: {testResult.statusCode}</p>
            )}
            
            {testResult.responseBody && (
              <div className="mt-2">
                <p className="text-xs font-medium mb-1">Response:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-32">
                  {testResult.responseBody}
                </pre>
              </div>
            )}
            
            {testResult.endpoints && (
              <div className="mt-4 space-y-3">
                <h5 className="text-sm font-medium">Endpoint Status:</h5>
                
                {testResult.endpoints.health && (
                  <div className="border-t pt-2">
                    <p className="text-xs font-medium">Health Endpoint:</p>
                    <p className="text-xs text-gray-600">Status: {testResult.endpoints.health.status}</p>
                    {testResult.endpoints.health.responseBody && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-24 mt-1">
                        {testResult.endpoints.health.responseBody}
                      </pre>
                    )}
                  </div>
                )}
                
                {testResult.endpoints.getLoginOTP && (
                  <div className="border-t pt-2">
                    <p className="text-xs font-medium">OTP Endpoint:</p>
                    <p className="text-xs text-gray-600">Status: {testResult.endpoints.getLoginOTP.status}</p>
                    {testResult.endpoints.getLoginOTP.responseBody && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-24 mt-1">
                        {testResult.endpoints.getLoginOTP.responseBody}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <Button onClick={handleSaveSettings} className="mt-4">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default EHRGeneralSettings;
