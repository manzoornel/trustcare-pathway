
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DoctorFormData } from "./types";

interface DoctorFormFieldsProps {
  doctor: DoctorFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvailableDaysChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
}

const DoctorFormFields = ({
  doctor,
  handleChange,
  handleLanguagesChange,
  handleAvailableDaysChange,
  handleCheckboxChange
}: DoctorFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <FormField
        id="name"
        label="Name*"
        value={doctor.name}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="specialty"
        label="Specialty*"
        value={doctor.specialty}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="qualification"
        label="Qualification*"
        value={doctor.qualification}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="experience"
        label="Experience*"
        value={doctor.experience}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="image"
        label="Image URL"
        value={doctor.image}
        onChange={handleChange}
      />
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="bio" className="text-right pt-2">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={doctor.bio}
          onChange={handleChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      
      <FormField
        id="languages"
        label="Languages"
        value={doctor.languages.join(", ")}
        onChange={handleLanguagesChange}
        placeholder="English, Hindi, etc. (comma separated)"
      />
      
      <FormField
        id="availableDays"
        label="Available Days"
        value={doctor.availableDays.join(", ")}
        onChange={handleAvailableDaysChange}
        placeholder="Monday, Tuesday, etc. (comma separated)"
      />
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="featured" className="text-right">
          Featured Doctor
        </Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={doctor.featured}
            onCheckedChange={handleCheckboxChange}
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Display on homepage
          </label>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormField = ({ id, label, value, onChange, placeholder, required }: FormFieldProps) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Input
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="col-span-3"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default DoctorFormFields;
