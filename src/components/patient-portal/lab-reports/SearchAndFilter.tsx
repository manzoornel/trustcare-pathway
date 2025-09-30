import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      {/* Search Input */}
      <div className="w-full md:w-1/3 min-w-[200px]">
        <Input
          placeholder={t('lab.search.placeholder')}
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
          {isComparing ? t('lab.compare.cancel') : t('lab.compare.button')}
        </Button>

        {isComparing && (
          <Button
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="whitespace-nowrap w-full sm:w-auto"
          >
            <LineChart className="h-4 w-4 mr-2" />
            {t('lab.compare.selected', { count: selectedCount.toString() })}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
