
import React from "react";
import { Button } from "@/components/ui/button";
import { SavedApplication, clearSavedApplication } from "./ApplicationFormTypes";

interface ResumeApplicationPromptProps {
  savedApplication: SavedApplication;
  onResume: () => void;
  onStartNew: () => void;
}

const ResumeApplicationPrompt: React.FC<ResumeApplicationPromptProps> = ({ 
  savedApplication, 
  onResume, 
  onStartNew 
}) => {
  const savedDate = new Date(savedApplication.lastUpdated);
  const formattedDate = savedDate.toLocaleDateString() + ' at ' + savedDate.toLocaleTimeString();
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h4 className="text-lg font-medium mb-4">
        Resume Your Application
      </h4>
      <p className="text-gray-600 mb-4">
        You have a saved application for this position from {formattedDate}. Would you like to continue where you left off?
      </p>
      <div className="flex space-x-4">
        <Button onClick={onResume} variant="default">
          Resume Application
        </Button>
        <Button 
          onClick={onStartNew} 
          variant="outline"
        >
          Start New Application
        </Button>
      </div>
    </div>
  );
};

export default ResumeApplicationPrompt;
