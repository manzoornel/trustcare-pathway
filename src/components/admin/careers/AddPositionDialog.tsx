
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddPositionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPosition: () => void;
  newPosition: { title: string };
  setNewPosition: (position: { title: string }) => void;
}

const AddPositionDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddPosition,
  newPosition,
  setNewPosition
}: AddPositionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="position-title">Position Title</label>
            <Input
              id="position-title"
              value={newPosition.title}
              onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
              placeholder="Enter position title"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddPosition}>Add Position</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPositionDialog;
