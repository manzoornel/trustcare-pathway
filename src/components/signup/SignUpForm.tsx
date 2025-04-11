
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpFormData, validateSignUpForm } from "@/utils/signupValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<void>;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    phone: "",
    hospitalId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form data
    if (!validateSignUpForm(formData)) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Signup submission error:", error);
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred during signup");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <Input
          id="phone"
          name="phone"
          placeholder="Enter your 10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <p className="text-xs text-gray-500">Must be a 10-digit number</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="hospitalId" className="text-sm font-medium">Hospital ID (UHID) <span className="text-xs text-gray-500 ml-1">(optional)</span></label>
        <Input
          id="hospitalId"
          name="hospitalId"
          placeholder="Enter your hospital ID if available"
          value={formData.hospitalId}
          onChange={handleChange}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          You can add this later in your patient portal
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <p className="text-xs text-gray-500">Must be at least 6 characters</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUpForm;
