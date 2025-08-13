import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PatientInfoField from "./PatientInfoField";
import HospitalIdField from "./HospitalIdField";
import PatientInfoFooter from "./PatientInfoFooter";
import { usePatientInfoForm } from "@/hooks/usePatientInfoForm";
import { instance } from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";

interface Patient {
  patient_id: string;
  patient_name: string;
}

interface PatientInfoCardProps {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
  onRegisterOpenEdit?: (openEdit: () => void) => void;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientName,
  hospitalId,
  phone,
  email,
  onRegisterOpenEdit,
}) => {
  const navigate = useNavigate();
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
    setIsEditing,
    showVerifyModal,
    setShowVerifyModal,
  } = usePatientInfoForm({ patientName, hospitalId, phone, email });

  const isDemoAccount = auth.userId?.startsWith("demo-");
  const missingHospitalId = !formData.hospitalId;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<string>(
    localStorage.getItem("patient_id") || ""
  );
  const [otp, setOtp] = useState<string>("");
  const [otperror, setOtperror] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Collapse behavior for very small devices (<500px)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 500 : false
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 500 : false
  );

  useEffect(() => {
    const onResize = () => {
      const small = window.innerWidth < 500;
      setIsSmallScreen(small);
      if (!small) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await instance.post(
        "getPatientsByMobile",
        {},
        {
          params: { mobile: localStorage.getItem("phone") },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (
        response?.data?.code === 0 &&
        (response?.data?.status === "Invalid token payload." ||
          response?.data?.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      } else if (response?.data?.code === 1) {
        setPatients(response?.data?.data);
      } else {
        toast.error("Error fetching patients");
      }
    } catch (error) {
      toast.error("Failed to fetch patients");
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Expose an external way to open the edit state from other tabs (e.g., Lab Reports)
  useEffect(() => {
    if (onRegisterOpenEdit) {
      onRegisterOpenEdit(() => {
        if (isSmallScreen) {
          setIsCollapsed(false);
        }
        setIsEditing(true);
      });
    }
  }, [onRegisterOpenEdit, setIsEditing, isSmallScreen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setOtperror("");
      if (!otp || otp.length !== 6) {
        setOtperror("OTP must be exactly 6 digits.");
        return;
      }

      if (!formData.email) {
        toast.error("Please enter email first.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await instance.post(
          `verifyOtpEmail`,
          {
            email: formData.email,
            patient_id: localStorage.getItem("patient_id"),
            otp,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setShowVerifyModal(false);

        if (response.data.code === 1) {
          toast.success("Profile updated successfully");
          if (
            response?.data?.data?.is_email_verified == 1 ||
            response?.data?.data?.is_email_verified == true
          ) {
            localStorage.setItem("email", response?.data?.data?.email);
            localStorage.setItem(
              "is_email_verified",
              response?.data?.data?.is_email_verified
            );
          } else {
            localStorage.setItem("email", "");
            localStorage.setItem("is_email_verified", "0");
          }
          setOtp("");
          setOtperror("");
        } else if (
          response.data.code === 0 &&
          response.data.status === "Invalid OTP."
        ) {
          setOtperror("Invalid otp.");
          toast.error("Invalid Otp.");
          setShowVerifyModal(true);
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
          setOtperror("Failed to verify OTP.");
        }
      } catch (error) {
        toast.error("Failed to update profile");
        console.error("Error updating profile:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [otp, formData.email, navigate, setShowVerifyModal]
  );

  const handleswitch = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await instance.post(
        `switchPatientAccount`,
        {
          patient_id: e.target.value,
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
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2">
        <CardTitle>Patient Information</CardTitle>
        <div className="flex gap-2 items-center flex-wrap">
          {isDemoAccount && (
            <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              Demo Account
            </div>
          )}
          {isSmallScreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed((c) => !c)}
              className="flex items-center gap-1"
            >
              {isCollapsed ? "Show" : "Hide"}
            </Button>
          )}
          {(!isSmallScreen || !isCollapsed) && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {missingHospitalId && !isEditing && (
          <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            Please add your Hospital ID (UHID) to connect with your medical
            records.
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

        {/* Collapsible Patient Info fields on very small screens */}
        <div
          className={`${
            isSmallScreen && isCollapsed ? "hidden" : "grid"
          } grid-cols-1 md:grid-cols-2 gap-4`}
        >
          <PatientInfoField
            label="Name"
            value={formData.name}
            isEditing={false}
            name="name"
            onChange={handleChange}
          />
          <HospitalIdField
            hospitalId={formData.hospitalId}
            isEditing={false}
            isSyncing={isSyncing}
            onChange={handleChange}
            onSync={handleSyncPatientData}
          />
          <PatientInfoField
            label="Phone"
            value={formData.phone}
            isEditing={false}
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

        {/* Patient Switch - stays visible even when collapsed */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Switch patient
          </label>
          <select
            className="bg-[#ECECFB] p-2 rounded-lg text-sm w-full sm:w-[280px] border border-gray-300 outline-none"
            value={currentPatient}
            onChange={(e) => handleswitch(e)}
            disabled={isLoading}
          >
            {patients?.map((patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {patient.patient_name}
              </option>
            ))}
          </select>
        </div>
      </CardContent>

      {isEditing && (
        <PatientInfoFooter
          isSubmitting={isSubmitting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <Transition appear show={showVerifyModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowVerifyModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-gray-900"
              >
                Enter OTP
              </Dialog.Title>
              <p className="text-sm text-gray-500 mb-4">
                Please enter the 6-digit code sent to your email.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Note:It may take sometime
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full border rounded px-4 py-2 mb-4 text-center tracking-widest text-xl font-mono"
                placeholder="------"
                disabled={isLoading}
              />
              {otperror && <h6 className="text-red-500">{otperror}</h6>}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  onClick={() => {
                    setOtp("");
                    setShowVerifyModal(false);
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </Card>
  );
};

export default PatientInfoCard;
