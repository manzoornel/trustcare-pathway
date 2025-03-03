
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    positions: string;
  }) => void;
}

const AddCategoryDialog = ({ isOpen, onOpenChange, onAddCategory }: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState<{
    id: string;
    title: string;
    description: string;
    requirements: string;
    positions: string;
  }>({
    id: "",
    title: "",
    description: "",
    requirements: "",
    positions: "" // Comma-separated position titles
  });

  const handleSubmit = () => {
    onAddCategory(newCategory);
    // Reset form
    setNewCategory({
      id: "",
      title: "",
      description: "",
      requirements: "",
      positions: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Career Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title">Category Title</label>
            <Input
              id="title"
              value={newCategory.title}
              onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
              placeholder="E.g., Doctors, Administrative Staff"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Input
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Describe this career category"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="requirements">Requirements</label>
            <Input
              id="requirements"
              value={newCategory.requirements}
              onChange={(e) => setNewCategory({...newCategory, requirements: e.target.value})}
              placeholder="Required qualifications or experience"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="positions">Initial Positions (comma-separated)</label>
            <Input
              id="positions"
              value={newCategory.positions}
              onChange={(e) => setNewCategory({...newCategory, positions: e.target.value})}
              placeholder="E.g., General Physician, Cardiologist, Pediatrician"
            />
            <p className="text-xs text-gray-500">Enter position titles separated by commas</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
