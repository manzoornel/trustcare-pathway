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
      {/* Search Input */}
      <div className="w-full md:w-1/3 min-w-[200px]">
        <Input
          placeholder="Search reports..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <Button
          variant={isComparing ? "default" : "outline"}
          onClick={onToggleCompare}
          className="whitespace-nowrap w-full sm:w-auto"
        >
          {isComparing ? "Cancel Compare" : "Compare Reports"}
        </Button>

        {isComparing && (
          <Button
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="whitespace-nowrap w-full sm:w-auto"
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
