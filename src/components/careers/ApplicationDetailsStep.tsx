
import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormErrors, FormData } from "./ApplicationFormTypes";

interface ApplicationDetailsStepProps {
  formData: FormData;
  resumeFile: File | null;
  termsAccepted: boolean;
  errors: FormErrors;
  touched: Record<string, boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (fieldName: string) => void;
  setTermsAccepted: (value: boolean) => void;
}

const ApplicationDetailsStep: React.FC<ApplicationDetailsStepProps> = ({
  formData,
  resumeFile,
  termsAccepted,
  errors,
  touched,
  handleInputChange,
  handleFileChange,
  handleBlur,
  setTermsAccepted,
}) => {
  return (
    <>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <Input
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          onBlur={() => handleBlur("experience")}
          placeholder="5"
          className={errors.experience && touched.experience ? "border-red-500" : ""}
          aria-invalid={Boolean(errors.experience && touched.experience)}
          aria-describedby={errors.experience && touched.experience ? "experience-error" : undefined}
        />
        {errors.experience && touched.experience && (
          <p id="experience-error" className="mt-1 text-sm text-red-500">
            {errors.experience}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Resume (PDF) *
        </label>
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          onBlur={() => handleBlur("resume")}
          className={`cursor-pointer ${errors.resume && touched.resume ? "border-red-500" : ""}`}
          aria-invalid={Boolean(errors.resume && touched.resume)}
          aria-describedby={errors.resume && touched.resume ? "resume-error" : undefined}
        />
        {resumeFile && (
          <p className="mt-1 text-sm text-green-600">
            Selected file: {resumeFile.name}
          </p>
        )}
        {errors.resume && touched.resume && (
          <p id="resume-error" className="mt-1 text-sm text-red-500">
            {errors.resume}
          </p>
        )}
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted} 
          onCheckedChange={(checked) => {
            setTermsAccepted(checked === true);
            handleBlur("termsAccepted");
          }}
          className={errors.termsAccepted && touched.termsAccepted ? "border-red-500" : ""}
          aria-invalid={Boolean(errors.termsAccepted && touched.termsAccepted)}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I accept the terms and conditions *
          </label>
          {errors.termsAccepted && touched.termsAccepted && (
            <p className="text-sm text-red-500">{errors.termsAccepted}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationDetailsStep;
