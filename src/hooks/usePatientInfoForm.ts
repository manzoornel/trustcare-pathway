
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    name: initialData.patientName || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    hospitalId: initialData.hospitalId || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validate inputs
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      // Update profile
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        hospitalId: formData.hospitalId
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
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
      name: initialData.patientName || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      hospitalId: initialData.hospitalId || ""
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
      const response = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'sync', 
          patientId: auth.userId,
          patientEhrId: formData.hospitalId || initialData.hospitalId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to sync with EHR");
      }
      
      if (response.data && response.data.success) {
        toast.success("Successfully synced with EHR system");
      } else {
        const errorMsg = response.data?.message || "Failed to sync with EHR system";
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
    setIsEditing
  };
};
