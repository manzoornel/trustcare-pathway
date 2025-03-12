
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EHRIntegrationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ehrConfig, setEhrConfig] = useState({
    id: '',
    api_endpoint: '',
    api_key: '',
    is_active: false,
    last_sync_time: null
  });

  useEffect(() => {
    fetchEHRConfig();
  }, []);

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
    // In a real implementation, you would test the connection to the EHR API
    toast.info('This is a simulated test. In a real implementation, this would test the connection to your EHR system.');
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EHR Integration Settings</CardTitle>
        <CardDescription>
          Configure connection to your Electronic Health Record system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api_endpoint">API Endpoint URL</Label>
          <Input
            id="api_endpoint"
            placeholder="https://your-ehr-system.com/api"
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
            disabled={!ehrConfig.api_endpoint || !ehrConfig.api_key}
            className="flex-1"
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EHRIntegrationSettings;
