
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  FormData, 
  SavedApplication,
  saveApplicationToStorage,
  getApplicationFromStorage,
  clearSavedApplication 
} from "../ApplicationFormTypes";

interface UseSavedApplicationProps {
  selectedCategory: string;
  selectedPosition: string;
}

export const useSavedApplication = ({ 
  selectedCategory, 
  selectedPosition 
}: UseSavedApplicationProps) => {
  const [hasSavedApplication, setHasSavedApplication] = useState(false);
  
  useEffect(() => {
    const savedApplication = getApplicationFromStorage();
    
    if (savedApplication && 
        savedApplication.selectedCategory === selectedCategory && 
        savedApplication.selectedPosition === selectedPosition) {
      setHasSavedApplication(true);
    }
  }, [selectedCategory, selectedPosition]);

  const handleResumeSavedApplication = () => {
    const savedApplication = getApplicationFromStorage();
    
    if (!savedApplication) {
      toast.error("No saved application found");
      return null;
    }
    
    setHasSavedApplication(false);
    toast.success("Application progress restored");
    
    return savedApplication;
  };

  const handleStartNewApplication = () => {
    clearSavedApplication();
    setHasSavedApplication(false);
  };

  const handleSaveAndExit = () => {
    toast.success("Your application progress has been saved. You can return to complete it later.");
  };

  return {
    hasSavedApplication,
    handleResumeSavedApplication,
    handleStartNewApplication,
    handleSaveAndExit
  };
};
