
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useEHRConfig } from './useEHRConfig';
import { Progress } from "@/components/ui/progress";

const EHRSyncStatus = ({ onManualSync }: { onManualSync: () => Promise<void> }) => {
  const { ehrConfig, isLoading } = useEHRConfig();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onManualSync();
    } finally {
      // Add a slight delay to ensure the updated data is fetched
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  const getStatusIndicator = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-5 h-5 mr-2" />
          <span>Loading status...</span>
        </div>
      );
    }

    if (!ehrConfig.is_active) {
      return (
        <div className="flex items-center text-amber-500">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Integration inactive</span>
        </div>
      );
    }

    if (!ehrConfig.last_sync_time) {
      return (
        <div className="flex items-center text-amber-500">
          <Clock className="w-5 h-5 mr-2" />
          <span>Never synchronized</span>
        </div>
      );
    }

    // Check if last sync was within the last 24 hours
    const lastSync = new Date(ehrConfig.last_sync_time);
    const now = new Date();
    const timeDiff = now.getTime() - lastSync.getTime();
    const isRecent = timeDiff < 24 * 60 * 60 * 1000; // 24 hours

    if (isRecent) {
      return (
        <div className="flex items-center text-green-500">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span>Synchronized</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-500">
          <XCircle className="w-5 h-5 mr-2" />
          <span>Sync outdated</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">EHR Synchronization</h3>
          <p className="text-sm text-muted-foreground">
            {ehrConfig.last_sync_time ? (
              <>Last synchronized: {new Date(ehrConfig.last_sync_time).toLocaleString()}</>
            ) : (
              <>Never synchronized</>
            )}
          </p>
        </div>
        <div>{getStatusIndicator()}</div>
      </div>
      
      {isSyncing && (
        <div className="mb-4">
          <p className="text-sm mb-2">Synchronizing data...</p>
          <Progress value={75} className="h-2" />
        </div>
      )}
      
      <Button 
        onClick={handleSync}
        disabled={isSyncing || isLoading || !ehrConfig.is_active}
        className="w-full"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Synchronizing...' : 'Synchronize Now'}
      </Button>
    </div>
  );
};

export default EHRSyncStatus;
