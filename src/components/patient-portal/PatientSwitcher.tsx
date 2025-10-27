import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Users } from "lucide-react";
import { toast } from "react-toastify";

interface Patient {
  patient_id: string;
  patient_name: string;
  uhid?: string;
  phone?: string;
  email?: string;
}

interface PatientSwitcherProps {
  currentPatientId: string;
  onPatientSwitch?: () => void;
}

export const PatientSwitcher: React.FC<PatientSwitcherProps> = ({
  currentPatientId,
  onPatientSwitch,
}) => {
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // Load available patients from localStorage
    const patientsData = localStorage.getItem("available_patients");
    if (patientsData) {
      try {
        const patients = JSON.parse(patientsData);
        setAvailablePatients(patients);
        
        // Find current patient
        const current = patients.find(
          (p: Patient) => p.patient_id === currentPatientId
        );
        setCurrentPatient(current || null);
      } catch (error) {
        console.error("Error parsing available patients:", error);
      }
    }
  }, [currentPatientId]);

  const handlePatientSwitch = (patient: Patient) => {
    if (patient.patient_id === currentPatientId) {
      return; // Already viewing this patient
    }

    // Update localStorage with new patient data
    localStorage.setItem("patient_id", patient.patient_id);
    localStorage.setItem("patient_name", patient.patient_name);
    localStorage.setItem("uhid", patient.uhid || "");
    if (patient.phone) localStorage.setItem("phone", patient.phone);
    if (patient.email) localStorage.setItem("email", patient.email);

    toast.success(`Switched to ${patient.patient_name}'s profile`);
    
    // Reload the page to fetch new patient's data
    if (onPatientSwitch) {
      onPatientSwitch();
    } else {
      window.location.reload();
    }
  };

  // Only show switcher if there are multiple patients
  if (!availablePatients || availablePatients.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">
                  {currentPatient?.patient_name || "Select Patient"}
                </div>
                {currentPatient?.uhid && (
                  <div className="text-xs text-muted-foreground">
                    UHID: {currentPatient.uhid}
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Switch Patient Profile
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availablePatients.map((patient) => (
            <DropdownMenuItem
              key={patient.patient_id}
              onClick={() => handlePatientSwitch(patient)}
              className={`cursor-pointer ${
                patient.patient_id === currentPatientId
                  ? "bg-primary/10 font-semibold"
                  : ""
              }`}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{patient.patient_name}</span>
                  {patient.patient_id === currentPatientId && (
                    <span className="ml-auto text-xs text-primary">
                      Current
                    </span>
                  )}
                </div>
                {patient.uhid && (
                  <div className="text-xs text-muted-foreground ml-6">
                    UHID: {patient.uhid}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Tap to switch between family members
      </p>
    </div>
  );
};
