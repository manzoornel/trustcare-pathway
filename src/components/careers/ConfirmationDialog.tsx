
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormData } from "./ApplicationFormTypes";
import { Check, AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  resumeFile: File | null;
  onConfirm: () => void;
  isSubmitting: boolean;
  selectedPosition: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  formData,
  resumeFile,
  onConfirm,
  isSubmitting,
  selectedPosition,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Application Submission
          </DialogTitle>
          <DialogDescription>
            Please review your application details before submitting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Position</h4>
            <p className="text-sm">{selectedPosition}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
            <p className="text-sm">Name: {formData.name}</p>
            <p className="text-sm">Email: {formData.email}</p>
            <p className="text-sm">Phone: {formData.phone}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Experience</h4>
            <p className="text-sm">{formData.experience} years</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Resume</h4>
            <p className="text-sm">{resumeFile?.name || "No file selected"}</p>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Back to Edit
          </Button>
          <Button 
            type="button" 
            className="gap-2" 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : (
              <>
                <Check className="h-4 w-4" />
                Confirm & Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
