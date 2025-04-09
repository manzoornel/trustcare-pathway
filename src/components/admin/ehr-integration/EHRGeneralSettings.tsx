
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import EHRTestResult from './EHRTestResult';
import { useEHRConfig } from './useEHRConfig';

const EHRGeneralSettings = () => {
  const {
    ehrConfig,
    setEhrConfig,
    isSaving,
    isTesting,
    testResult,
    handleSaveConfig,
    handleTestConnection
  } = useEHRConfig();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="api_endpoint">API Endpoint URL</Label>
        <Input
          id="api_endpoint"
          placeholder="http://your-ehr-system.com/api"
          value={ehrConfig.api_endpoint}
          onChange={(e) => setEhrConfig({...ehrConfig, api_endpoint: e.target.value})}
        />
        <p className="text-sm text-gray-500">
          The base URL of your EHR system's API
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api_key">API Key</Label>
        <Input
          id="api_key"
          type="password"
          placeholder="Your EHR API Key"
          value={ehrConfig.api_key}
          onChange={(e) => setEhrConfig({...ehrConfig, api_key: e.target.value})}
        />
        <p className="text-sm text-gray-500">
          Authentication key for your EHR system API
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="active_status">Active Status</Label>
          <p className="text-sm text-gray-500">
            Enable or disable EHR integration
          </p>
        </div>
        <Switch
          id="active_status"
          checked={ehrConfig.is_active}
          onCheckedChange={(checked) => setEhrConfig({...ehrConfig, is_active: checked})}
        />
      </div>

      {ehrConfig.last_sync_time && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Last synchronized: {new Date(ehrConfig.last_sync_time).toLocaleString()}
          </p>
        </div>
      )}

      <EHRTestResult testResult={testResult} />

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleTestConnection}
          disabled={!ehrConfig.api_endpoint || !ehrConfig.api_key || isTesting}
          className="flex-1"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>
    </>
  );
};

export default EHRGeneralSettings;
