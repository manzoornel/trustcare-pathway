
import React from "react";
import { Input } from "@/components/ui/input";
import { FormData } from "./ApplicationFormTypes";

interface VerifiedContactInfoProps {
  formData: FormData;
}

const VerifiedContactInfo: React.FC<VerifiedContactInfoProps> = ({ formData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address (Verified)
        </label>
        <Input
          value={formData.email}
          readOnly
          className="bg-gray-50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Verified)
        </label>
        <Input
          value={formData.phone}
          readOnly
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default VerifiedContactInfo;
