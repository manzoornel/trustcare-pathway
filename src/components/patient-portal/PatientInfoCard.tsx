
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PatientInfoField from "./PatientInfoField";
import HospitalIdField from "./HospitalIdField";
import PatientInfoFooter from "./PatientInfoFooter";
import { usePatientInfoForm } from "@/hooks/usePatientInfoForm";

type PatientInfoCardProps = {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
};

const PatientInfoCard = ({ patientName, hospitalId, phone, email }: PatientInfoCardProps) => {
  const { auth } = useAuth();
  const { 
    formData, 
    isEditing, 
    isSubmitting, 
    isSyncing,
    handleChange,
    handleSave,
    handleCancel,
    handleSyncPatientData,
    setIsEditing
  } = usePatientInfoForm({ patientName, hospitalId, phone, email });

  const isDemoAccount = auth.userId?.startsWith('demo-');
  const missingHospitalId = !formData.hospitalId;

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Patient Information</CardTitle>
        <div className="flex gap-2 items-center">
          {isDemoAccount && (
            <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Demo Account</div>
          )}
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {missingHospitalId && !isEditing && (
          <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            Please add your Hospital ID (UHID) to connect with your medical records.
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setIsEditing(true)} 
              className="text-amber-700 p-0 ml-1"
            >
              Add now
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PatientInfoField
            label="Name"
            value={formData.name}
            isEditing={isEditing}
            name="name"
            onChange={handleChange}
          />
          
          <HospitalIdField
            hospitalId={formData.hospitalId}
            isEditing={isEditing}
            isSyncing={isSyncing}
            onChange={handleChange}
            onSync={handleSyncPatientData}
          />
          
          <PatientInfoField
            label="Phone"
            value={formData.phone}
            isEditing={isEditing}
            name="phone"
            onChange={handleChange}
          />
          
          <PatientInfoField
            label="Email"
            value={formData.email}
            isEditing={isEditing}
            name="email"
            onChange={handleChange}
          />
        </div>
      </CardContent>
      
      {isEditing && (
        <PatientInfoFooter
          isSubmitting={isSubmitting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </Card>
  );
};

export default PatientInfoCard;
