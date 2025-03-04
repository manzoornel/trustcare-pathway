
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JobCategory } from "./JobListingSection";
import ContactInfoStep from "./ContactInfoStep";
import OTPVerificationStep from "./OTPVerificationStep";
import ApplicationDetailsStep from "./ApplicationDetailsStep";
import VerifiedContactInfo from "./VerifiedContactInfo";
import NameField from "./NameField";
import ResumeApplicationPrompt from "./ResumeApplicationPrompt";
import ConfirmationDialog from "./ConfirmationDialog";
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
  const selectedPositionTitle = selectedCategoryData?.positions.find(p => p.id === selectedPosition)?.title || "";
  
  const {
    formData,
    resumeFile,
    termsAccepted,
    errors,
    touched,
    isSubmitting,
    isValidating,
    submitError,
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
    setOtpSent,
    handleSendOTP,
    resetSubmitError
  } = useApplicationForm({ selectedCategory, selectedPosition });

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

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

  // Handle the form submission process
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP is not sent yet, call handleSendOTP
    if (!otpSent) {
      handleSendOTP();
      return;
    }
    
    // If OTP is sent but not verified, do nothing (OTPVerificationStep handles verification)
    if (otpSent && !otpVerified) {
      return;
    }
    
    // If OTP is verified, show confirmation dialog
    setShowConfirmDialog(true);
    // Reset any previous submit errors when opening the dialog
    resetSubmitError();
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">
          Apply for: {selectedPositionTitle}
        </h4>
        
        {/* Save & Exit button - only show once some data has been entered */}
        {(formData.name || formData.email || formData.phone) && (
          <Button variant="outline" onClick={handleSaveAndExit} type="button" disabled={isSubmitting || isValidating}>
            Save & Exit
          </Button>
        )}
      </div>
      
      {/* Show validation in progress message */}
      {isValidating && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Validating your information...
          </AlertDescription>
        </Alert>
      )}
      
      {submitError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <NameField
          name={formData.name}
          onChange={handleInputChange}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          touched={touched.name}
          disabled={isSubmitting || isValidating}
        />
        
        {/* Render different form sections based on the verification state */}
        {!otpSent ? (
          <ContactInfoStep 
            formData={formData}
            errors={errors}
            touched={touched}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            disabled={isSubmitting || isValidating}
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
            disabled={isSubmitting || isValidating}
          />
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isValidating}
        >
          {isSubmitting || isValidating ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isValidating ? "Validating..." : "Processing..."}
            </span>
          ) : !otpSent ? "Verify Contact" :
             !otpVerified ? "Verify OTP" :
             "Submit Application"}
        </Button>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        formData={formData}
        resumeFile={resumeFile}
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleSubmit();
        }}
        isSubmitting={isSubmitting || isValidating}
        submitError={submitError}
        selectedPosition={selectedPositionTitle}
      />
    </div>
  );
};

export default ApplicationForm;
