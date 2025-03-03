
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobCategory } from "@/components/careers/CareersData";
import CategoryCard from "./careers/CategoryCard";
import AddCategoryDialog from "./careers/AddCategoryDialog";
import EditCategoryDialog from "./careers/EditCategoryDialog";
import AddPositionDialog from "./careers/AddPositionDialog";

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
  
  const [newPosition, setNewPosition] = useState({
    title: ""
  });

  const handleAddCategory = (newCategory: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    positions: string;
  }) => {
    // Split comma-separated positions and format them
    const positionsList = newCategory.positions.split(',').map(pos => {
      const title = pos.trim();
      // Create an ID from the title (lowercase with hyphens)
      const id = title.toLowerCase().replace(/\s+/g, '-');
      return { id, title };
    }).filter(pos => pos.title); // Remove empty positions
    
    const category: JobCategory = {
      id: newCategory.title.toLowerCase().replace(/\s+/g, '-'),
      title: newCategory.title,
      description: newCategory.description,
      requirements: newCategory.requirements,
      positions: positionsList
    };
    
    setJobCategories([...jobCategories, category]);
    setIsAddCategoryDialogOpen(false);
    toast.success("Career category added successfully");
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

  const handleUpdateCategory = (field: string, value: string) => {
    if (currentCategoryIndex === null) return;
    
    const updatedCategories = [...jobCategories];
    updatedCategories[currentCategoryIndex] = {
      ...updatedCategories[currentCategoryIndex],
      [field]: value
    };
    setJobCategories(updatedCategories);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Career Opportunities</h2>
        <Button onClick={() => setIsAddCategoryDialogOpen(true)}>Add New Category</Button>
      </div>

      <div className="space-y-6">
        {jobCategories.map((category, categoryIndex) => (
          <CategoryCard 
            key={category.id}
            category={category}
            categoryIndex={categoryIndex}
            onEditCategory={(index) => {
              setCurrentCategoryIndex(index);
              setIsEditCategoryDialogOpen(true);
            }}
            onDeleteCategory={handleDeleteCategory}
            onAddPosition={(index) => {
              setCurrentCategoryIndex(index);
              setIsAddPositionDialogOpen(true);
            }}
            onDeletePosition={handleDeletePosition}
          />
        ))}
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        isOpen={isEditCategoryDialogOpen}
        onOpenChange={setIsEditCategoryDialogOpen}
        currentCategory={currentCategoryIndex !== null ? jobCategories[currentCategoryIndex] : null}
        onEditCategory={handleEditCategory}
        onUpdateCategory={handleUpdateCategory}
      />

      {/* Add Position Dialog */}
      <AddPositionDialog
        isOpen={isAddPositionDialogOpen}
        onOpenChange={setIsAddPositionDialogOpen}
        onAddPosition={handleAddPosition}
        newPosition={newPosition}
        setNewPosition={setNewPosition}
      />
    </div>
  );
};

export default CareerManagement;
