
import React from "react";
import { Button } from "@/components/ui/button";
import { JobCategory } from "./JobListingSection";
import ContactInfoStep from "./ContactInfoStep";
import OTPVerificationStep from "./OTPVerificationStep";
import ApplicationDetailsStep from "./ApplicationDetailsStep";
import VerifiedContactInfo from "./VerifiedContactInfo";
import NameField from "./NameField";
import ResumeApplicationPrompt from "./ResumeApplicationPrompt";
import { getApplicationFromStorage } from "./ApplicationFormTypes";
import { useApplicationForm } from "./useApplicationForm";

interface ApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
  jobCategories: JobCategory[];
}

const ApplicationForm = ({ 
  selectedCategory, 
  selectedPosition, 
  jobCategories 
}: ApplicationFormProps) => {
  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);
  
  const {
    formData,
    resumeFile,
    termsAccepted,
    errors,
    touched,
    isSubmitting,
    otpSent,
    otpVerified,
    hasSavedApplication,
    setTermsAccepted,
    handleInputChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    handleSaveAndExit,
    handleResumeSavedApplication,
    handleStartNewApplication,
    setOtpVerified,
    setOtpSent
  } = useApplicationForm({ selectedCategory, selectedPosition });

  if (!selectedPosition) return null;

  // Show resume application prompt if there's a saved application for this position
  if (hasSavedApplication) {
    const savedApplication = getApplicationFromStorage();
    if (!savedApplication) return null;
    
    return (
      <ResumeApplicationPrompt
        savedApplication={savedApplication}
        onResume={handleResumeSavedApplication}
        onStartNew={handleStartNewApplication}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">
          Apply for: {selectedCategoryData?.positions.find(p => p.id === selectedPosition)?.title}
        </h4>
        
        {/* Save & Exit button - only show once some data has been entered */}
        {(formData.name || formData.email || formData.phone) && (
          <Button variant="outline" onClick={handleSaveAndExit} type="button">
            Save & Exit
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <NameField
          name={formData.name}
          onChange={handleInputChange}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          touched={touched.name}
        />
        
        {/* Render different form sections based on the verification state */}
        {!otpSent ? (
          <ContactInfoStep 
            formData={formData}
            errors={errors}
            touched={touched}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
          />
        ) : otpSent && !otpVerified ? (
          <OTPVerificationStep 
            email={formData.email}
            phone={formData.phone}
            onVerificationComplete={() => setOtpVerified(true)}
            onBackToContact={() => setOtpSent(false)}
          />
        ) : (
          <VerifiedContactInfo formData={formData} />
        )}
        
        {/* Show application details only after OTP verification */}
        {otpVerified && (
          <ApplicationDetailsStep 
            formData={formData}
            resumeFile={resumeFile}
            termsAccepted={termsAccepted}
            errors={errors}
            touched={touched}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleBlur={handleBlur}
            setTermsAccepted={setTermsAccepted}
          />
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : 
           !otpSent ? "Verify Contact" :
           !otpVerified ? "Verify OTP" :
           "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
