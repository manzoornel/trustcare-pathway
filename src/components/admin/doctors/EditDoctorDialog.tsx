
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DoctorFormFields from "./DoctorFormFields";
import { useDoctorForm } from "./useDoctorForm";
import { DoctorFormData } from "./types";

interface EditDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorFormData;
  onUpdate: (doctor: DoctorFormData) => void;
}

const EditDoctorDialog = ({ isOpen, onClose, doctor, onUpdate }: EditDoctorDialogProps) => {
  const {
    doctorData,
    handleChange,
    handleLanguagesChange,
    handleAvailableDaysChange,
    handleCheckboxChange,
    resetForm,
    validateForm
  } = useDoctorForm(doctor);

  useEffect(() => {
    resetForm(doctor);
  }, [doctor]);

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }
    onUpdate(doctorData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Doctor: {doctor.name}</DialogTitle>
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
            Update Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDoctorDialog;
