import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Hash, Phone, Mail, ChevronRight } from "lucide-react";

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
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-xl font-bold text-neutral-900">
            Select Patient Profile
          </DialogTitle>
          <DialogDescription>
            {patients.length} profiles found on this number — pick the one you want to view.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {patients.map((patient) => (
            <button
              key={patient.patient_id}
              onClick={() => onSelectPatient(patient)}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-teal-50 active:bg-teal-100 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                <User className="h-4.5 w-4.5 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-neutral-900 truncate">
                  {patient.patient_name}
                </div>
                {(patient.uhid || patient.phone || patient.email) && (
                  <div className="flex flex-wrap gap-x-3 text-xs text-neutral-500 mt-0.5">
                    {patient.uhid && (
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" /> {patient.uhid}
                      </span>
                    )}
                    {patient.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {patient.phone}
                      </span>
                    )}
                    {patient.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" /> {patient.email}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSelectionDialog;
