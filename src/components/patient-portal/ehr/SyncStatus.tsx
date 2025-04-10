
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

type SyncStatusProps = {
  ehrActive: boolean;
  ehrPatientId: string | null;
  lastSyncTime: string | null;
};

const SyncStatus: React.FC<SyncStatusProps> = ({ ehrActive, ehrPatientId, lastSyncTime }) => {
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

export default SyncStatus;
