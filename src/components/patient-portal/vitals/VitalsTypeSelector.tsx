
import React from "react";
import { Activity, Heart, Thermometer, Minus } from "lucide-react";
import { VitalType, VitalTypeInfo } from "./mockData";
import { Button } from "@/components/ui/button";

interface VitalsTypeSelectorProps {
  vitalTypes: VitalTypeInfo[];
  selectedType: VitalType;
  onSelectType: (type: VitalType) => void;
}

const VitalsTypeSelector: React.FC<VitalsTypeSelectorProps> = ({
  vitalTypes,
  selectedType,
  onSelectType
}) => {
  // Helper function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "heart-pulse":
        return <Heart className="h-4 w-4" />;
      case "thermometer":
        return <Thermometer className="h-4 w-4" />;
      case "activity":
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {vitalTypes.map((vitalType) => (
        <Button
          key={vitalType.type}
          variant={selectedType === vitalType.type ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectType(vitalType.type)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          {renderIcon(vitalType.icon)}
          <span>{vitalType.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default VitalsTypeSelector;
