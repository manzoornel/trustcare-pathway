
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobCategory } from "@/components/careers/CareersData";

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: JobCategory | null;
  onEditCategory: () => void;
  onUpdateCategory: (field: string, value: string) => void;
}

const EditCategoryDialog = ({ 
  isOpen, 
  onOpenChange,
  currentCategory,
  onEditCategory,
  onUpdateCategory
}: EditCategoryDialogProps) => {
  if (!currentCategory) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Career Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-title">Category Title</label>
            <Input
              id="edit-title"
              value={currentCategory.title}
              onChange={(e) => onUpdateCategory('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-description">Description</label>
            <Input
              id="edit-description"
              value={currentCategory.description}
              onChange={(e) => onUpdateCategory('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-requirements">Requirements</label>
            <Input
              id="edit-requirements"
              value={currentCategory.requirements}
              onChange={(e) => onUpdateCategory('requirements', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onEditCategory}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
