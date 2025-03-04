
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobCategory } from "./JobListingSection";
import ContactInfoStep from "./ContactInfoStep";
import OTPVerificationStep from "./OTPVerificationStep";
import ApplicationDetailsStep from "./ApplicationDetailsStep";
import { 
  FormData, 
  FormErrors, 
  SavedApplication,
  saveApplicationToStorage,
  getApplicationFromStorage,
  clearSavedApplication 
} from "./ApplicationFormTypes";
import { useFormValidation } from "./useFormValidation";

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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resumeUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Application form steps
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // Save/resume related states
  const [hasSavedApplication, setHasSavedApplication] = useState(false);

  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);
  const { validateField, validateForm, hasErrors } = useFormValidation();

  // Check for saved application on initial load
  useEffect(() => {
    const savedApplication = getApplicationFromStorage();
    
    if (savedApplication && 
        savedApplication.selectedCategory === selectedCategory && 
        savedApplication.selectedPosition === selectedPosition) {
      setHasSavedApplication(true);
    }
  }, [selectedCategory, selectedPosition]);

  // Load saved application data if user chooses to resume
  const handleResumeSavedApplication = () => {
    const savedApplication = getApplicationFromStorage();
    
    if (!savedApplication) {
      toast.error("No saved application found");
      return;
    }
    
    setFormData(savedApplication.formData);
    setOtpVerified(savedApplication.otpVerified);
    setOtpSent(savedApplication.otpVerified); // If OTP was verified, it was also sent
    
    // Mark all fields as touched
    const touchedFields = Object.keys(savedApplication.formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(touchedFields);
    
    setHasSavedApplication(false);
    toast.success("Application progress restored");
  };

  // Auto-save application progress when form data changes
  useEffect(() => {
    if (formData.name || formData.email || formData.phone || formData.experience) {
      const applicationData: SavedApplication = {
        formData,
        selectedCategory,
        selectedPosition,
        lastUpdated: Date.now(),
        otpVerified
      };
      
      saveApplicationToStorage(applicationData);
    }
  }, [formData, selectedCategory, selectedPosition, otpVerified]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // Validate the file
      const error = validateField("resume", file);
      setErrors(prev => ({ ...prev, resume: error }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate the field when it loses focus
    const value = fieldName === "resume" 
      ? resumeFile 
      : fieldName === "termsAccepted" 
        ? termsAccepted 
        : formData[fieldName as keyof typeof formData];
        
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleSendOTP = async () => {
    // Validate email and phone before sending OTP
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    
    setErrors(prev => ({ 
      ...prev, 
      email: emailError,
      phone: phoneError
    }));
    
    setTouched(prev => ({ 
      ...prev, 
      email: true,
      phone: true 
    }));
    
    if (emailError || phoneError) {
      toast.error("Please provide valid email and phone number");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate OTP sending API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSent(true);
      toast.success(`Verification code sent to ${formData.phone} and ${formData.email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP verification is not done yet, trigger it
    if (!otpSent) {
      handleSendOTP();
      return;
    }
    
    // Check if all fields are valid
    const newErrors = validateForm(formData, resumeFile, termsAccepted, otpSent, otpVerified, "");
    setErrors(newErrors);
    
    // Mark all fields as touched to show validation errors
    const allTouched = Object.keys(formData).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      { resume: true, termsAccepted: true }
    );
    setTouched(allTouched);
    
    if (hasErrors(newErrors)) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (!selectedCategory || !selectedPosition) {
      toast.error("Please select a job category and position");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your application has been submitted successfully!");
      
      // Clear saved application on successful submission
      clearSavedApplication();
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        resumeUrl: "",
      });
      setResumeFile(null);
      setTermsAccepted(false);
      setTouched({});
      setErrors({});
      setOtpSent(false);
      setOtpVerified(false);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = () => {
    // We're already auto-saving, so just need to show confirmation
    toast.success("Your application progress has been saved. You can return to complete it later.");
  };

  if (!selectedPosition) return null;

  // Show resume application prompt if there's a saved application for this position
  if (hasSavedApplication) {
    const savedApplication = getApplicationFromStorage();
    if (!savedApplication) return null;
    
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
          <Button onClick={handleResumeSavedApplication} variant="default">
            Resume Application
          </Button>
          <Button 
            onClick={() => {
              clearSavedApplication();
              setHasSavedApplication(false);
            }} 
            variant="outline"
          >
            Start New Application
          </Button>
        </div>
      </div>
    );
  }

  const renderVerifiedContactInfo = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address (Verified)
          </label>
          <Input
            value={formData.email}
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Verified)
          </label>
          <Input
            value={formData.phone}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
    );
  };

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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur("name")}
            placeholder="John Doe"
            className={errors.name && touched.name ? "border-red-500" : ""}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? "name-error" : undefined}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="mt-1 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>
        
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
          renderVerifiedContactInfo()
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
