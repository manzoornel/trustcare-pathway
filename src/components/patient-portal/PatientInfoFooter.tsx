
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

type PatientInfoFooterProps = {
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
};

const PatientInfoFooter = ({ 
  isSubmitting, 
  onSave, 
  onCancel 
}: PatientInfoFooterProps) => {
  return (
    <CardFooter className="flex justify-end gap-2 pt-0">
      <Button variant="outline" size="sm" onClick={onCancel} className="flex items-center gap-1">
        <X className="h-4 w-4" />
        Cancel
      </Button>
      <Button 
        size="sm" 
        onClick={onSave} 
        className="flex items-center gap-1"
        disabled={isSubmitting}
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </CardFooter>
  );
};

export default PatientInfoFooter;
