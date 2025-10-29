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
import { instance } from "../../axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate()
  const handlePatientSwitch = async (patient: Patient) => {
    if (patient.patient_id === currentPatientId) {
      return; // Already viewing this patient
    }

   try { 
      const response = await instance.post(
        `switchPatientAccount`,
        {
          patient_id: patient.patient_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        toast.success("Profile updated successfully");
        localStorage.setItem("email", response?.data?.data?.email);
        localStorage.setItem(
          "is_email_verified",
          response?.data?.data?.is_email_verified
        );
        localStorage.setItem("patient_id", response?.data?.data?.patient_id);
        localStorage.setItem(
          "patient_name",
          response?.data?.data?.patient_name
        );
        setCurrentPatient(response?.data?.data?.patient_name);
        localStorage.setItem("token", response?.data?.data?.token);
        localStorage.setItem("uhid", response?.data?.data?.uhid);
        localStorage.setItem("email", response?.data?.data?.email);
        window.location.reload();
      } else if (
        response.data.code === 0 &&
        (response.data.status === "Invalid token payload." ||
          response.data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally { 
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
        <DropdownMenuContent className="w-[300px] bg-background border-primary/30 shadow-xl z-50">
          <DropdownMenuLabel className="flex items-center gap-2 text-foreground font-semibold">
            <Users className="h-4 w-4 text-primary" />
            Switch Patient Profile
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          {availablePatients.map((patient) => (
            <DropdownMenuItem
              key={patient.patient_id}
              onClick={() => handlePatientSwitch(patient)}
              className={`cursor-pointer hover:bg-primary/20 transition-colors ${
                patient.patient_id === currentPatientId
                  ? "bg-primary/10 font-semibold text-foreground"
                  : "text-foreground"
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
