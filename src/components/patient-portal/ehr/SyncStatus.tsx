
import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

type SyncStatusProps = {
  ehrActive: boolean;
  ehrPatientId: string | null;
  lastSyncTime: string | null;
  onRefresh?: () => void;
};

const SyncStatus: React.FC<SyncStatusProps> = ({
  ehrActive,
  ehrPatientId,
  lastSyncTime,
  onRefresh
}) => {
  if (!ehrActive || !ehrPatientId) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4 border-t pt-3">
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 text-gray-400 mr-1" />
        {lastSyncTime ? (
          <span className="text-gray-600">Last synced: {new Date(lastSyncTime).toLocaleString()}</span>
        ) : (
          <span className="text-amber-600">Never synchronized</span>
        )}
      </div>
      {onRefresh && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default SyncStatus;
