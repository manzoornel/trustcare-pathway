
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import EHRLoginButton from './EHRLoginButton';
import EHRDataSyncButton from './EHRDataSyncButton';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EHRConnectionPanel = () => {
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
      }
    };
    
    checkEhrConfig();
  }, []);

  // Fetch EHR connection status
  useEffect(() => {
    const fetchEhrConnection = async () => {
      if (!auth.userId) return;
      
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
    
    fetchEhrConnection();
  }, [auth.userId]);
  
  const activateEHRIntegration = async () => {
    if (ehrActive || isActivating) return;
    
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
            api_key: 'default-key', // This would need to be replaced with a proper key
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

  // Manually activate integration button handler
  const handleManualActivation = async () => {
    await activateEHRIntegration();
  };

  const renderConnectionStatus = () => {
    if (isActivating) {
      return (
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-700">Activating EHR integration...</span>
        </div>
      );
    }
    
    if (!ehrActive) {
      return (
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-amber-700">EHR integration needs activation</span>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-500">Checking connection...</span>
        </div>
      );
    }
    
    if (ehrPatientId) {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">Connected to EHR</span>
          <Badge className="ml-2 bg-blue-500">ID: {ehrPatientId}</Badge>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">Not connected to EHR</span>
      </div>
    );
  };
  
  const renderSyncStatus = () => {
    if (!ehrActive || !ehrPatientId) return null;
    
    if (lastSyncTime) {
      // Check if last sync was within 24 hours
      const syncDate = new Date(lastSyncTime);
      const now = new Date();
      const timeDiff = now.getTime() - syncDate.getTime();
      const isRecent = timeDiff < 24 * 60 * 60 * 1000; // 24 hours
      
      return (
        <div className={`flex items-center ${isRecent ? 'text-green-700' : 'text-amber-700'}`}>
          <Clock className={`h-5 w-5 mr-2 ${isRecent ? 'text-green-500' : 'text-amber-500'}`} />
          <span>Last sync: {new Date(lastSyncTime).toLocaleString()}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-amber-700">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
        <span>Never synchronized</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>EHR Connection</CardTitle>
        <CardDescription>
          Connect and sync your medical records from the hospital's EHR system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-gray-50">
          {renderConnectionStatus()}
          {renderSyncStatus()}
        </div>
        
        {!ehrActive && !isActivating ? (
          <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-amber-700">
                  The EHR integration needs to be activated. Simply connect with your phone number below to automatically activate it.
                </p>
                {activationError && (
                  <div className="text-sm text-red-600">
                    Activation failed: {activationError}
                  </div>
                )}
                {activationAttempted && (
                  <Button onClick={handleManualActivation} className="mt-2" variant="secondary" size="sm">
                    Retry Activation
                  </Button>
                )}
                {auth.role && auth.role === 'admin' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/settings" className="inline-flex items-center">
                      <span>Go to Admin Settings</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : !ehrPatientId ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Connect to the hospital's Electronic Health Record system to access your complete medical history.
            </p>
            <EHRLoginButton onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Synchronize your data to get the latest updates from the hospital's records.
            </p>
            <EHRDataSyncButton 
              ehrPatientId={ehrPatientId} 
              onSyncComplete={handleSyncComplete} 
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-start border-t pt-4">
        <div className="text-xs text-gray-500">
          Your health records are synchronized securely from the hospital's EHR system.
        </div>
      </CardFooter>
    </Card>
  );
};

export default EHRConnectionPanel;
