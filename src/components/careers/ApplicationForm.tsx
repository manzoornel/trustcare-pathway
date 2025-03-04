
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobCategory } from "./JobListingSection";
import { Checkbox } from "@/components/ui/checkbox";
import OTPInput from "@/components/OTPInput";

interface ApplicationFormProps {
  selectedCategory: string;
  selectedPosition: string;
  jobCategories: JobCategory[];
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (allow various formats)
const PHONE_REGEX = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  resume?: string;
  termsAccepted?: string;
  otp?: string;
};

const ApplicationForm = ({ 
  selectedCategory, 
  selectedPosition, 
  jobCategories 
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
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
  
  // OTP related states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const selectedCategoryData = jobCategories.find((cat) => cat.id === selectedCategory);

  const validateField = (name: string, value: string | File | null | boolean): string | undefined => {
    switch (name) {
      case "name":
        return value && typeof value === 'string' && value.trim().length >= 3 
          ? undefined 
          : "Full name is required (minimum 3 characters)";
      case "email":
        return value && typeof value === 'string' && EMAIL_REGEX.test(value) 
          ? undefined 
          : "Please enter a valid email address";
      case "phone":
        return value && typeof value === 'string' && PHONE_REGEX.test(value) 
          ? undefined 
          : "Please enter a valid phone number";
      case "experience":
        return value && typeof value === 'string' && !isNaN(Number(value)) 
          ? undefined 
          : "Please enter a valid number of years";
      case "resume":
        return value 
          ? undefined 
          : "Please upload your resume (PDF format)";
      case "termsAccepted":
        return value === true 
          ? undefined 
          : "You must accept the terms and conditions";
      case "otp":
        return value && typeof value === 'string' && value.length === 6
          ? undefined
          : "Please enter the 6-digit verification code";
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate all fields
    newErrors.name = validateField("name", formData.name);
    newErrors.email = validateField("email", formData.email);
    newErrors.phone = validateField("phone", formData.phone);
    newErrors.experience = validateField("experience", formData.experience);
    newErrors.resume = validateField("resume", resumeFile);
    newErrors.termsAccepted = validateField("termsAccepted", termsAccepted);
    
    // Only validate OTP if we're in the verification step
    if (otpSent && !otpVerified) {
      newErrors.otp = validateField("otp", otp);
    }
    
    // Update the errors state
    setErrors(newErrors);
    
    // Form is valid if no error messages exist
    return !Object.values(newErrors).some(error => error !== undefined);
  };

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
      
      // Start the countdown timer for resend
      setTimeLeft(60);
      setResendDisabled(true);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      setOtpSent(true);
      toast.success(`Verification code sent to ${formData.phone} and ${formData.email}`);
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: "Please enter the 6-digit verification code" }));
      return;
    }
    
    try {
      setIsVerifying(true);
      
      // Simulate OTP verification API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll consider "123456" as the valid OTP
      if (otp === "123456") {
        setOtpVerified(true);
        toast.success("Phone and email verified successfully");
      } else {
        toast.error("Invalid verification code. Please try again.");
        setErrors(prev => ({ ...prev, otp: "Invalid verification code" }));
      }
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setTimeLeft(60);
    toast.info("New verification code sent to your phone and email");
    
    // Start the countdown again
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP verification is not done yet, trigger it
    if (!otpSent) {
      handleSendOTP();
      return;
    }
    
    // If OTP is sent but not verified yet, verify it
    if (otpSent && !otpVerified) {
      handleVerifyOTP();
      return;
    }
    
    // Mark all fields as touched to show all validation errors
    const allTouched = Object.keys(formData).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      { resume: true, termsAccepted: true }
    );
    setTouched(allTouched);
    
    // Run full validation
    if (!validateForm()) {
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
      setOtp("");
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPosition) return null;

  // Render different sections of the form based on the verification state
  const renderContactAndOTPSection = () => {
    if (!otpSent) {
      return (
        <>
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
        </>
      );
    }
    
    if (otpSent && !otpVerified) {
      return (
        <div className="rounded-lg bg-gray-50 p-4 mb-4">
          <h3 className="text-md font-medium mb-2">Verify Your Contact</h3>
          <p className="text-sm text-gray-600 mb-4">
            A verification code has been sent to your phone ({formData.phone}) and email ({formData.email}).
          </p>
          
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code *
            </label>
            <OTPInput
              value={otp}
              onChange={setOtp}
              valueLength={6}
              containerClassName="justify-center mb-2"
            />
            {errors.otp && (
              <p className="text-sm text-red-500 text-center">
                {errors.otp}
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto" 
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              Resend Code
              {resendDisabled && ` (${timeLeft}s)`}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleVerifyOTP}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      );
    }
    
    // If verified, just show read-only info
    if (otpVerified) {
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
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h4 className="text-lg font-medium mb-4">
        Apply for: {selectedCategoryData?.positions.find(p => p.id === selectedPosition)?.title}
      </h4>
      
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
        
        {renderContactAndOTPSection()}
        
        {otpVerified && (
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
