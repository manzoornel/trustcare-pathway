
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  onCompare: () => void;
  selectedCount: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  isComparing,
  onToggleCompare,
  onCompare,
  selectedCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="w-full md:w-1/3">
        <Input
          placeholder="Search reports..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={isComparing ? "default" : "outline"}
          onClick={onToggleCompare}
          className="whitespace-nowrap"
        >
          {isComparing ? "Cancel Compare" : "Compare Reports"}
        </Button>
        {isComparing && (
          <Button
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="whitespace-nowrap"
          >
            <LineChart className="h-4 w-4 mr-2" />
            Compare Selected ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
