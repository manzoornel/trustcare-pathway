
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface AddDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doctor: any) => void;
}

const AddDoctorDialog = ({ isOpen, onClose, onAdd }: AddDoctorDialogProps) => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    bio: "",
    qualification: "",
    experience: "",
    image: "/lovable-uploads/54ce09cc-73b7-4e3a-abdc-fedcc93cc51c.png", // Default image
    languages: ["English"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguagesChange = (e) => {
    const value = e.target.value;
    setNewDoctor((prev) => ({
      ...prev,
      languages: value.split(",").map((lang) => lang.trim()),
    }));
  };

  const handleAvailableDaysChange = (e) => {
    const value = e.target.value;
    setNewDoctor((prev) => ({
      ...prev,
      availableDays: value.split(",").map((day) => day.trim()),
    }));
  };

  const handleCheckboxChange = (checked) => {
    setNewDoctor((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = () => {
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.qualification || !newDoctor.experience) {
      alert("Please fill in all required fields");
      return;
    }
    onAdd(newDoctor);
    setNewDoctor({
      name: "",
      specialty: "",
      bio: "",
      qualification: "",
      experience: "",
      image: "/lovable-uploads/54ce09cc-73b7-4e3a-abdc-fedcc93cc51c.png",
      languages: ["English"],
      availableDays: ["Monday", "Wednesday", "Friday"],
      featured: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <Input
              id="name"
              name="name"
              value={newDoctor.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialty" className="text-right">
              Specialty*
            </Label>
            <Input
              id="specialty"
              name="specialty"
              value={newDoctor.specialty}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="qualification" className="text-right">
              Qualification*
            </Label>
            <Input
              id="qualification"
              name="qualification"
              value={newDoctor.qualification}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">
              Experience*
            </Label>
            <Input
              id="experience"
              name="experience"
              value={newDoctor.experience}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              name="image"
              value={newDoctor.image}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bio" className="text-right pt-2">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={newDoctor.bio}
              onChange={handleChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languages" className="text-right">
              Languages
            </Label>
            <Input
              id="languages"
              placeholder="English, Hindi, etc. (comma separated)"
              value={newDoctor.languages.join(", ")}
              onChange={handleLanguagesChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availableDays" className="text-right">
              Available Days
            </Label>
            <Input
              id="availableDays"
              placeholder="Monday, Tuesday, etc. (comma separated)"
              value={newDoctor.availableDays.join(", ")}
              onChange={handleAvailableDaysChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="featured" className="text-right">
              Featured Doctor
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={newDoctor.featured}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="featured"
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
            Add Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;
