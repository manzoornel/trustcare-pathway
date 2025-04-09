
import React, { useState } from 'react';
import { useEHRSyncHistory } from './useEHRSyncHistory';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import EHRSyncStatus from './EHRSyncStatus';
import EHRSyncHistory from './EHRSyncHistory';

const EHRSyncMonitoring = () => {
  const { syncHistory, isLoading, refreshHistory, triggerManualSync } = useEHRSyncHistory();
  const [patientId, setPatientId] = useState('');
  
  const handleManualSync = async () => {
    await triggerManualSync(patientId || undefined);
    refreshHistory();
  };
  
  return (
    <div className="space-y-6">
      <EHRSyncStatus onManualSync={handleManualSync} />
      
      <div className="border rounded-lg shadow-sm bg-card p-4">
        <h3 className="text-lg font-medium mb-3">Sync Specific Patient</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => triggerManualSync(patientId)}
            disabled={!patientId.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            Sync Patient
          </Button>
        </div>
      </div>
      
      <EHRSyncHistory 
        syncHistory={syncHistory} 
        isLoading={isLoading} 
        onRefresh={refreshHistory}
      />
    </div>
  );
};

export default EHRSyncMonitoring;
