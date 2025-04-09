
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EHRIntegrationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [ehrConfig, setEhrConfig] = useState({
    id: '',
    api_endpoint: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
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
  
  const apiEndpoints = [
    { name: 'getLoginOTP', description: 'Generate OTP for login' },
    { name: 'patientLogin', description: 'Login API' },
    { name: 'fetchAppointments', description: 'Fetch all appointments of the patient' },
    { name: 'listDoctors', description: 'Show all doctors' },
    { name: 'getDoctorSlots', description: 'Fetch all available slots of the doctor' },
    { name: 'createAppointment', description: 'Booking API' },
    { name: 'fetchPatientVisits', description: 'Fetch the visits against patient' },
    { name: 'fetchVisits', description: 'Fetch all visits of the patient' },
    { name: 'fetchLabReports', description: 'Lab report against the visit' },
    { name: 'fetchPatientMedications', description: 'Patient Medications against the visit' }
  ];

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
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="api-endpoints">Available Endpoints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
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

            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
              }`}>
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                    </p>
                    <p className="text-sm mt-1">
                      {testResult.message}
                    </p>
                  </div>
                </div>
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
                disabled={!ehrConfig.api_endpoint || !ehrConfig.api_key || isTesting}
                className="flex-1"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="api-endpoints" className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              The following API endpoints are available for integration with your EHR system:
            </p>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {apiEndpoints.map((endpoint, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {endpoint.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {endpoint.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700">
                    How to use these endpoints
                  </p>
                  <p className="text-sm mt-1">
                    These endpoints are automatically called by our system when patients use the patient portal. 
                    No additional setup is required beyond configuring the API key and endpoint URL in the General Settings tab.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EHRIntegrationSettings;
