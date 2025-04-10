
import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

type ConnectionStatusProps = {
  isLoading: boolean;
  isActivating: boolean;
  ehrActive: boolean;
  ehrPatientId: string | null;
};

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isLoading,
  isActivating,
  ehrActive,
  ehrPatientId
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-gray-500">Checking connection...</span>
      </div>
    );
  }
  
  if (isActivating) {
    return (
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
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

export default ConnectionStatus;
