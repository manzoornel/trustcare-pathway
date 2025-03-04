
import React from "react";
import { Input } from "@/components/ui/input";
import { FormErrors, FormData } from "./ApplicationFormTypes";

interface ContactInfoStepProps {
  formData: FormData;
  errors: FormErrors;
  touched: Record<string, boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (fieldName: string) => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleBlur("email")}
          placeholder="john@example.com"
          className={errors.email && touched.email ? "border-red-500" : ""}
          aria-invalid={Boolean(errors.email && touched.email)}
          aria-describedby={errors.email && touched.email ? "email-error" : undefined}
        />
        {errors.email && touched.email && (
          <p id="email-error" className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          onBlur={() => handleBlur("phone")}
          placeholder="+91 9876543210"
          className={errors.phone && touched.phone ? "border-red-500" : ""}
          aria-invalid={Boolean(errors.phone && touched.phone)}
          aria-describedby={errors.phone && touched.phone ? "phone-error" : undefined}
        />
        {errors.phone && touched.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-500">
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactInfoStep;
