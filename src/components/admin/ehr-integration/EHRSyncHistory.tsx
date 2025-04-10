
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EHRSyncHistory as EHRSyncHistoryType } from './types';

type EHRSyncHistoryProps = {
  syncHistory: EHRSyncHistoryType[];
  isLoading: boolean;
  onRefresh: () => void;
};

const EHRSyncHistory = ({ syncHistory, isLoading, onRefresh }: EHRSyncHistoryProps) => {
  return (
    <div className="border rounded-lg shadow-sm bg-card">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Synchronization History</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : syncHistory.length === 0 ? (
        <div className="p-8 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No synchronization history available</p>
          <p className="text-sm text-muted-foreground mt-1">
            History will appear after the first synchronization
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.status === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {record.status === 'failed' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {record.status === 'in_progress' && (
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(record.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {record.patient_id || 'All Patients'}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-xs">{record.message}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default EHRSyncHistory;
