
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
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import EHRLoginButton from './EHRLoginButton';
import EHRDataSyncButton from './EHRDataSyncButton';

const EHRConnectionPanel = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [ehrPatientId, setEhrPatientId] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

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
  
  const handleLoginSuccess = (patientId: string) => {
    setEhrPatientId(patientId);
  };
  
  const handleSyncComplete = () => {
    setLastSyncTime(new Date().toISOString());
  };

  const renderConnectionStatus = () => {
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
    if (!ehrPatientId) return null;
    
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
        
        {!ehrPatientId ? (
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
