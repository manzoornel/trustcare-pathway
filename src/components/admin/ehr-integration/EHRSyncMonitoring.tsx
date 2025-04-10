
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEHRSyncHistory } from './useEHRSyncHistory';
import { useEHRConfig } from './useEHRConfig';
import EHRSyncHistory from './EHRSyncHistory';
import EHRSyncStatus from './EHRSyncStatus';

const EHRSyncMonitoring = () => {
  const { syncHistory, isLoading, refreshHistory, triggerManualSync } = useEHRSyncHistory();
  const { config, isLoading: configLoading } = useEHRConfig();
  
  const handleSyncNow = async () => {
    await triggerManualSync();
    refreshHistory();
  };

  const isConfigured = !configLoading && config && config.apiEndpoint && config.apiKey && config.isActive;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">EHR Synchronization</h3>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage data synchronization with your EHR system
        </p>
      </div>

      {!isConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-700 text-sm">
            EHR integration is not fully configured or enabled. Please complete the setup in the General Settings tab.
          </p>
        </div>
      )}
      
      <EHRSyncStatus onManualSync={handleSyncNow} />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSyncNow} 
          disabled={isLoading || !isConfigured}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Now
        </Button>
      </div>
      
      <div className="mt-8">
        <h4 className="text-md font-medium mb-4">Recent Sync History</h4>
        <EHRSyncHistory 
          syncHistory={syncHistory} 
          isLoading={isLoading} 
          onRefresh={refreshHistory}
        />
      </div>
    </div>
  );
};

export default EHRSyncMonitoring;
