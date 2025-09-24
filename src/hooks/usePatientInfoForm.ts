import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { instance } from "./../axios";

type FormData = {
  name: string;
  phone: string;
  email: string;
  hospitalId: string;
};

export const usePatientInfoForm = (initialData: {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
}) => {
  const { updateProfile, auth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: initialData.patientName || localStorage.getItem("patient_name") || "",
    phone: initialData.phone || localStorage.getItem("phone") || "",
    email: initialData.email || localStorage.getItem("email") || "",
    hospitalId: initialData.hospitalId || localStorage.getItem("uhid") || "",
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validate inputs

    if (!formData.email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    try {
      setIsSubmitting(true);

      const { data } = await instance.post(
        `sendOtpEmail?email=${formData.email}&patient_id=${localStorage.getItem(
          "patient_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsEditing(false);

      if (data.code === 1) {
        toast.success("Profile updated successfully");
        setShowVerifyModal(true);
        console.log(showVerifyModal);
      } else if (data.code === 0 && data.status === "Invalid OTP.") {
        toast.error("Invalid Otp.");
        setShowVerifyModal(true);
        return;
      } else if (
        data.code === 0 &&
        (data.status === "Invalid token payload." ||
          data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login", { replace: true });
      } else {
        console.error("Error fetching medications:", data.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name:
        initialData.patientName || localStorage.getItem("patient_name") || "",
      phone: initialData.phone || localStorage.getItem("phone") || "",
      email: initialData.email || localStorage.getItem("email") || "",
      hospitalId: initialData.hospitalId || localStorage.getItem("uhid") || "",
    });
    setIsEditing(false);
  };

  const handleSyncPatientData = async () => {
    if (!auth.userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setIsSyncing(true);
    try {
      // Call the EHR sync function with your patient ID
      const response = await supabase.functions.invoke("ehr-sync", {
        body: {
          action: "sync",
          patientId: auth.userId,
          patientEhrId: formData.hospitalId || initialData.hospitalId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to sync with EHR");
      }

      if (response.data && response.data.success) {
        toast.success("Successfully synced with EHR system");
      } else {
        const errorMsg =
          response.data?.message || "Failed to sync with EHR system";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error syncing with EHR:", error);
      toast.error("Error connecting to EHR system. Please try again later.");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
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
  };
};
