
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Save, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type PatientInfoCardProps = {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
};

const PatientInfoCard = ({ patientName, hospitalId, phone, email }: PatientInfoCardProps) => {
  const { updateProfile, auth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientName || "",
    phone: phone || "",
    email: email || "",
    hospitalId: hospitalId || ""
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
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: patientName || "",
      phone: phone || "",
      email: email || "",
      hospitalId: hospitalId || ""
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
          patientEhrId: formData.hospitalId || hospitalId
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

  const isDemoAccount = auth.userId?.startsWith('demo-');

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            {isEditing ? (
              <Input 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p>{patientName || "Not available"}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hospital ID (UHID)</p>
            {isEditing ? (
              <Input 
                name="hospitalId" 
                value={formData.hospitalId}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter your Hospital ID"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p>{hospitalId || "Not available"}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncPatientData} 
                  disabled={isSyncing || (!hospitalId && !formData.hospitalId)}
                  className="ml-2"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            {isEditing ? (
              <Input 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p>{phone || "Not available"}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            {isEditing ? (
              <Input 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p>{email || "Not available"}</p>
            )}
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="sm" onClick={handleCancel} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="flex items-center gap-1"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PatientInfoCard;
