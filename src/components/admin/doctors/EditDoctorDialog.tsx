
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface EditDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: any;
  onUpdate: (doctor: any) => void;
}

const EditDoctorDialog = ({ isOpen, onClose, doctor, onUpdate }: EditDoctorDialogProps) => {
  const [editedDoctor, setEditedDoctor] = useState(doctor);

  useEffect(() => {
    setEditedDoctor(doctor);
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguagesChange = (e) => {
    const value = e.target.value;
    setEditedDoctor((prev) => ({
      ...prev,
      languages: value.split(",").map((lang) => lang.trim()),
    }));
  };

  const handleAvailableDaysChange = (e) => {
    const value = e.target.value;
    setEditedDoctor((prev) => ({
      ...prev,
      availableDays: value.split(",").map((day) => day.trim()),
    }));
  };

  const handleCheckboxChange = (checked) => {
    setEditedDoctor((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = () => {
    if (!editedDoctor.name || !editedDoctor.specialty || !editedDoctor.qualification || !editedDoctor.experience) {
      alert("Please fill in all required fields");
      return;
    }
    onUpdate(editedDoctor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Doctor: {doctor.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name*
            </Label>
            <Input
              id="edit-name"
              name="name"
              value={editedDoctor.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-specialty" className="text-right">
              Specialty*
            </Label>
            <Input
              id="edit-specialty"
              name="specialty"
              value={editedDoctor.specialty}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-qualification" className="text-right">
              Qualification*
            </Label>
            <Input
              id="edit-qualification"
              name="qualification"
              value={editedDoctor.qualification}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-experience" className="text-right">
              Experience*
            </Label>
            <Input
              id="edit-experience"
              name="experience"
              value={editedDoctor.experience}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-image" className="text-right">
              Image URL
            </Label>
            <Input
              id="edit-image"
              name="image"
              value={editedDoctor.image}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-bio" className="text-right pt-2">
              Bio
            </Label>
            <Textarea
              id="edit-bio"
              name="bio"
              value={editedDoctor.bio}
              onChange={handleChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-languages" className="text-right">
              Languages
            </Label>
            <Input
              id="edit-languages"
              placeholder="English, Hindi, etc. (comma separated)"
              value={editedDoctor.languages.join(", ")}
              onChange={handleLanguagesChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-availableDays" className="text-right">
              Available Days
            </Label>
            <Input
              id="edit-availableDays"
              placeholder="Monday, Tuesday, etc. (comma separated)"
              value={editedDoctor.availableDays.join(", ")}
              onChange={handleAvailableDaysChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-featured" className="text-right">
              Featured Doctor
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-featured"
                checked={editedDoctor.featured}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="edit-featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Display on homepage
              </label>
            </div>
          </div>
        </div>

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
