
import { useState } from "react";
import { DoctorFormData } from "./types";

export const useDoctorForm = (initialData: DoctorFormData) => {
  const [doctorData, setDoctorData] = useState<DoctorFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDoctorData((prev) => ({
      ...prev,
      languages: value.split(",").map((lang) => lang.trim()),
    }));
  };

  const handleAvailableDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDoctorData((prev) => ({
      ...prev,
      availableDays: value.split(",").map((day) => day.trim()),
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setDoctorData((prev) => ({ ...prev, featured: checked }));
  };
  
  const resetForm = (data: DoctorFormData) => {
    setDoctorData(data);
  };

  const validateForm = (): boolean => {
    return !!(
      doctorData.name && 
      doctorData.specialty && 
      doctorData.qualification && 
      doctorData.experience
    );
  };

  return {
    doctorData,
    handleChange,
    handleLanguagesChange,
    handleAvailableDaysChange,
    handleCheckboxChange,
    resetForm,
    validateForm
  };
};
