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
    <div className="mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3 bg-white border-neutral-200 hover:bg-neutral-50 hover:border-teal-300"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                <User className="h-4.5 w-4.5 text-teal-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-neutral-900 text-sm">
                  {currentPatient?.patient_name || "Select Patient"}
                </div>
                <div className="text-xs text-neutral-500">
                  {currentPatient?.uhid
                    ? `UHID: ${currentPatient.uhid}`
                    : `${availablePatients.length} profiles on this number`}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[300px] max-h-[60vh] overflow-y-auto bg-white border-neutral-200 shadow-xl z-50">
          <DropdownMenuLabel className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Users className="h-4 w-4 text-teal-600" />
            Switch Patient Profile
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availablePatients.map((patient) => (
            <DropdownMenuItem
              key={patient.patient_id}
              onClick={() => handlePatientSwitch(patient)}
              className={`cursor-pointer py-2.5 transition-colors ${
                patient.patient_id === currentPatientId
                  ? "bg-teal-50 font-semibold text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>{patient.patient_name}</span>
                  {patient.patient_id === currentPatientId && (
                    <span className="ml-auto text-xs text-teal-700 font-medium">
                      Current
                    </span>
                  )}
                </div>
                {patient.uhid && (
                  <div className="text-xs text-neutral-500 ml-6">
                    UHID: {patient.uhid}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-neutral-500 mt-2 text-center">
        Tap to switch between family members
      </p>
    </div>
  );
};
