
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DoctorFormFields from "./DoctorFormFields";
import { useDoctorForm } from "./useDoctorForm";
import { DoctorFormData } from "./types";

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doctor: DoctorFormData) => void;
}

const defaultDoctorData: DoctorFormData = {
  name: "",
  specialty: "",
  bio: "",
  qualification: "",
  experience: "",
  image: "/lovable-uploads/54ce09cc-73b7-4e3a-abdc-fedcc93cc51c.png", // Default image
  languages: ["English"],
  availableDays: ["Monday", "Wednesday", "Friday"],
  featured: false,
};

const AddDoctorDialog = ({ isOpen, onClose, onAdd }: AddDoctorDialogProps) => {
  const {
    doctorData,
    handleChange,
    handleLanguagesChange,
    handleAvailableDaysChange,
    handleCheckboxChange,
    resetForm,
    validateForm
  } = useDoctorForm(defaultDoctorData);

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }
    onAdd(doctorData);
    resetForm(defaultDoctorData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>

        <DoctorFormFields
          doctor={doctorData}
          handleChange={handleChange}
          handleLanguagesChange={handleLanguagesChange}
          handleAvailableDaysChange={handleAvailableDaysChange}
          handleCheckboxChange={handleCheckboxChange}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;
