
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCategory } from "@/components/careers/CareersData";
import { Pencil, Trash, Plus, X } from "lucide-react";

interface CategoryCardProps {
  category: JobCategory;
  categoryIndex: number;
  onEditCategory: (index: number) => void;
  onDeleteCategory: (index: number) => void;
  onAddPosition: (index: number) => void;
  onDeletePosition: (categoryIndex: number, positionIndex: number) => void;
}

const CategoryCard = ({
  category,
  categoryIndex,
  onEditCategory,
  onDeleteCategory,
  onAddPosition,
  onDeletePosition,
}: CategoryCardProps) => {
  return (
    <Card key={category.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle>{category.title}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditCategory(categoryIndex)}
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDeleteCategory(categoryIndex)}
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
              onClick={() => onAddPosition(categoryIndex)}
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
                  onClick={() => onDeletePosition(categoryIndex, positionIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
