
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
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

type PatientInfoCardProps = {
  patientName: string;
  hospitalId?: string;
  phone?: string;
  email?: string;
};

const PatientInfoCard = ({ patientName, hospitalId, phone, email }: PatientInfoCardProps) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientName || "",
    phone: phone || "",
    email: email || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
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

    // Update profile
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    });
    
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: patientName || "",
      phone: phone || "",
      email: email || ""
    });
    setIsEditing(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Patient Information</CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
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
            <p className="text-sm font-medium text-gray-500">Hospital ID</p>
            <p>{hospitalId || "Not available"}</p>
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
          <Button size="sm" onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PatientInfoCard;
