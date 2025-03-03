
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

type PatientInfoCardProps = {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
};

const PatientInfoCard = ({ patientName, hospitalId, phone, email }: PatientInfoCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p>{patientName || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hospital ID</p>
            <p>{hospitalId || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p>{phone || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{email || "Not available"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
