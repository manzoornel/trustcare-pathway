
import React from "react";
import { Input } from "@/components/ui/input";

type PatientInfoFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
};

const PatientInfoField = ({ 
  label, 
  value, 
  isEditing, 
  name, 
  onChange,
  children 
}: PatientInfoFieldProps) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing ? (
        <Input 
          name={name} 
          value={value}
          onChange={onChange}
          className="mt-1"
          placeholder={`Enter your ${label}`}
        />
      ) : (
        <div className="flex items-center gap-2">
          <p>{value || "Not available"}</p>
          {children}
        </div>
      )}
    </div>
  );
};

export default PatientInfoField;
