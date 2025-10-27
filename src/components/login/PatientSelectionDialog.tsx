import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Hash, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Patient {
  patient_id: string;
  patient_name: string;
  uhid?: string;
  phone?: string;
  email?: string;
}

interface PatientSelectionDialogProps {
  open: boolean;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onClose: () => void;
}

const PatientSelectionDialog: React.FC<PatientSelectionDialogProps> = ({
  open,
  patients,
  onSelectPatient,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Select Patient Profile
          </DialogTitle>
          <DialogDescription>
            Multiple patient records found. Please select which patient profile you want to access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {patients.map((patient, index) => (
            <Card
              key={patient.patient_id}
              className="p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">
                      {patient.patient_name}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {patient.uhid && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span>UHID: {patient.uhid}</span>
                      </div>
                    )}
                    
                    {patient.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    
                    {patient.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectPatient(patient)}
                  className="ml-4"
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSelectionDialog;
