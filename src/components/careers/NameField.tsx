
import React from "react";
import { Input } from "@/components/ui/input";

interface NameFieldProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const NameField: React.FC<NameFieldProps> = ({
  name,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false
}) => {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Full Name *
      </label>
      <Input
        id="name"
        name="name"
        value={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="John Doe"
        className={error && touched ? "border-red-500" : ""}
        aria-invalid={Boolean(error && touched)}
        aria-describedby={error && touched ? "name-error" : undefined}
        disabled={disabled}
      />
      {error && touched && (
        <p id="name-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default NameField;
