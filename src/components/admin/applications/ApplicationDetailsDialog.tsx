
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { Application, ApplicationStatus } from "./types";
import StatusBadge from "./StatusBadge";

interface ApplicationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}

const ApplicationDetailsDialog = ({ 
  open, 
  onOpenChange, 
  application, 
  onStatusChange 
}: ApplicationDetailsDialogProps) => {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Job Application Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{application.name}</h3>
            <StatusBadge status={application.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p>{application.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p>{application.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{application.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{application.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Education</p>
            <p className="mt-1">{application.education}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="mt-1">{application.experience}</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="font-semibold mb-2">Update Application Status</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={application.status === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(application.id, "new")}
              >
                New
              </Button>
              <Button 
                variant={application.status === "reviewed" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(application.id, "reviewed")}
              >
                Reviewed
              </Button>
              <Button 
                variant={application.status === "shortlisted" ? "default" : "outline"}
                size="sm"
                className={application.status === "shortlisted" ? "" : "text-green-600 border-green-600 hover:bg-green-50"}
                onClick={() => onStatusChange(application.id, "shortlisted")}
              >
                <Check className="h-4 w-4 mr-1" /> Shortlist
              </Button>
              <Button 
                variant={application.status === "rejected" ? "default" : "outline"}
                size="sm"
                className={application.status === "rejected" ? "bg-red-500" : "text-red-600 border-red-600 hover:bg-red-50"}
                onClick={() => onStatusChange(application.id, "rejected")}
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
