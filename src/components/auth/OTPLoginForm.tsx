
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OTPLoginFormProps {
  authenticatedUsers: Array<{
    hospitalId: string;
    phone: string;
    email: string;
    name: string;
    password: string;
  }>;
}

const OTPLoginForm: React.FC<OTPLoginFormProps> = ({ authenticatedUsers }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otpFormData, setOtpFormData] = useState({
    identifier: ""
  });

  const handleOtpFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = authenticatedUsers.find(
      u => u.hospitalId === otpFormData.identifier ||
           u.phone === otpFormData.identifier ||
           u.email === otpFormData.identifier
    );
    
    setTimeout(() => {
      if (user) {
        toast.success("OTP sent to your phone and email");
        localStorage.setItem("patientAuth", JSON.stringify({
          isAuthenticated: false,
          isVerified: false,
          name: user.name,
          phone: user.phone,
          hospitalId: user.hospitalId,
          email: user.email
        }));
        navigate("/verify-otp");
      } else {
        toast.error("User not found");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="otpIdentifier" className="text-sm font-medium">Hospital ID / Phone / Email</label>
        <Input
          id="otpIdentifier"
          name="identifier"
          placeholder="Enter your Hospital ID, Phone, or Email"
          value={otpFormData.identifier}
          onChange={handleOtpFormChange}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
};

export default OTPLoginForm;
