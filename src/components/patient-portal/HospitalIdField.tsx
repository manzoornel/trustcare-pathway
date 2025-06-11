import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PatientInfoField from "./PatientInfoField";

type HospitalIdFieldProps = {
  hospitalId: string;
  isEditing: boolean;
  isSyncing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSync: () => void;
};

const HospitalIdField = ({
  hospitalId,
  isEditing,
  isSyncing,
  onChange,
  onSync,
}: HospitalIdFieldProps) => {
  return (
    <PatientInfoField
      label="Hospital ID (UHID)"
      value={hospitalId}
      isEditing={isEditing}
      name="hospitalId"
      onChange={onChange}
    >
      {/* {!isEditing && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSync} 
          disabled={isSyncing || !hospitalId}
          className="ml-2"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync'}
        </Button>
      )} */}
    </PatientInfoField>
  );
};

export default HospitalIdField;
