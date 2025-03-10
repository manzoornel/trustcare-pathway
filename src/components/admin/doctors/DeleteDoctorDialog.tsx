
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: any;
  onDelete: () => void;
}

const DeleteDoctorDialog = ({ isOpen, onClose, doctor, onDelete }: DeleteDoctorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Doctor</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Dr. {doctor.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDoctorDialog;
