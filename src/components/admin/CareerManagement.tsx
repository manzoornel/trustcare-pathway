
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { JobCategory } from "@/components/careers/CareersData";

const CareerManagement = () => {
  // Get careers data from our existing data
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([
    {
      id: "doctor",
      title: "Doctors",
      positions: [
        { id: "general-physician", title: "General Physician" },
        { id: "pediatrician", title: "Pediatrician" },
        { id: "cardiologist", title: "Cardiologist" }
      ],
      description: "Join our team of medical professionals dedicated to providing exceptional patient care.",
      requirements: "MBBS/MD with relevant specialization and valid medical license."
    },
    {
      id: "nurse",
      title: "Nursing Staff",
      positions: [
        { id: "head-nurse", title: "Head Nurse" },
        { id: "staff-nurse", title: "Staff Nurse" }
      ],
      description: "Be part of our nursing team that provides compassionate and quality care to our patients.",
      requirements: "Nursing degree/diploma with relevant experience and registration."
    }
  ]);

  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isAddPositionDialogOpen, setIsAddPositionDialogOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);
  
  const [newCategory, setNewCategory] = useState<Omit<JobCategory, 'positions'> & { positions: string }>({
    id: "",
    title: "",
    description: "",
    requirements: "",
    positions: "" // Comma-separated position titles
  });
  
  const [newPosition, setNewPosition] = useState({
    title: ""
  });

  const handleAddCategory = () => {
    // Split comma-separated positions and format them
    const positionsList = newCategory.positions.split(',').map(pos => {
      const title = pos.trim();
      // Create an ID from the title (lowercase with hyphens)
      const id = title.toLowerCase().replace(/\s+/g, '-');
      return { id, title };
    }).filter(pos => pos.title); // Remove empty positions
    
    const category: JobCategory = {
      id: newCategory.id.toLowerCase().replace(/\s+/g, '-'),
      title: newCategory.title,
      description: newCategory.description,
      requirements: newCategory.requirements,
      positions: positionsList
    };
    
    setJobCategories([...jobCategories, category]);
    setIsAddCategoryDialogOpen(false);
    toast.success("Career category added successfully");
    
    // Reset form
    setNewCategory({
      id: "",
      title: "",
      description: "",
      requirements: "",
      positions: ""
    });
  };

  const handleEditCategory = () => {
    if (currentCategoryIndex === null) return;
    
    // Create updated categories array
    const updatedCategories = [...jobCategories];
    updatedCategories[currentCategoryIndex] = {
      ...updatedCategories[currentCategoryIndex]
    };
    
    setJobCategories(updatedCategories);
    setIsEditCategoryDialogOpen(false);
    toast.success("Career category updated successfully");
  };

  const handleDeleteCategory = (index: number) => {
    if (window.confirm("Are you sure you want to delete this career category?")) {
      const updatedCategories = [...jobCategories];
      updatedCategories.splice(index, 1);
      setJobCategories(updatedCategories);
      toast.success("Career category deleted successfully");
    }
  };

  const handleAddPosition = () => {
    if (currentCategoryIndex === null || !newPosition.title) return;
    
    const updatedCategories = [...jobCategories];
    const category = updatedCategories[currentCategoryIndex];
    
    // Create a new position with ID derived from title
    const positionId = newPosition.title.toLowerCase().replace(/\s+/g, '-');
    
    // Add the new position
    category.positions.push({
      id: positionId,
      title: newPosition.title
    });
    
    setJobCategories(updatedCategories);
    setIsAddPositionDialogOpen(false);
    setNewPosition({ title: "" });
    toast.success("Position added successfully");
  };

  const handleDeletePosition = (categoryIndex: number, positionIndex: number) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      const updatedCategories = [...jobCategories];
      updatedCategories[categoryIndex].positions.splice(positionIndex, 1);
      setJobCategories(updatedCategories);
      toast.success("Position deleted successfully");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Career Opportunities</h2>
        <Button onClick={() => setIsAddCategoryDialogOpen(true)}>Add New Category</Button>
      </div>

      <div className="space-y-6">
        {jobCategories.map((category, categoryIndex) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle>{category.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentCategoryIndex(categoryIndex);
                      setIsEditCategoryDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteCategory(categoryIndex)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm"><strong>Requirements:</strong> {category.requirements}</p>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Positions</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCurrentCategoryIndex(categoryIndex);
                      setIsAddPositionDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Position
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {category.positions.map((position, positionIndex) => (
                    <div 
                      key={position.id} 
                      className="bg-gray-50 p-2 rounded flex justify-between items-center"
                    >
                      <span>{position.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePosition(categoryIndex, positionIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Career Category</DialogTitle>
          </DialogHeader>
          {currentCategoryIndex !== null && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title">Category Title</label>
                <Input
                  id="edit-title"
                  value={jobCategories[currentCategoryIndex].title}
                  onChange={(e) => {
                    const updatedCategories = [...jobCategories];
                    updatedCategories[currentCategoryIndex] = {
                      ...updatedCategories[currentCategoryIndex],
                      title: e.target.value
                    };
                    setJobCategories(updatedCategories);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description">Description</label>
                <Input
                  id="edit-description"
                  value={jobCategories[currentCategoryIndex].description}
                  onChange={(e) => {
                    const updatedCategories = [...jobCategories];
                    updatedCategories[currentCategoryIndex] = {
                      ...updatedCategories[currentCategoryIndex],
                      description: e.target.value
                    };
                    setJobCategories(updatedCategories);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-requirements">Requirements</label>
                <Input
                  id="edit-requirements"
                  value={jobCategories[currentCategoryIndex].requirements}
                  onChange={(e) => {
                    const updatedCategories = [...jobCategories];
                    updatedCategories[currentCategoryIndex] = {
                      ...updatedCategories[currentCategoryIndex],
                      requirements: e.target.value
                    };
                    setJobCategories(updatedCategories);
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Position Dialog */}
      <Dialog open={isAddPositionDialogOpen} onOpenChange={setIsAddPositionDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddPositionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPosition}>Add Position</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerManagement;
