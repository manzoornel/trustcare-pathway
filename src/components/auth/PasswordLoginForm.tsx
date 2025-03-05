
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PasswordLoginFormProps {
  authenticatedUsers: Array<{
    hospitalId: string;
    phone: string;
    email: string;
    name: string;
    password: string;
  }>;
}

const PasswordLoginForm: React.FC<PasswordLoginFormProps> = ({ authenticatedUsers }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    identifier: "",
    password: ""
  });

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = authenticatedUsers.find(
      u => u.hospitalId === passwordFormData.identifier ||
           u.phone === passwordFormData.identifier ||
           u.email === passwordFormData.identifier
    );
    
    setTimeout(() => {
      if (user && user.password === passwordFormData.password) {
        toast.success("Login successful");
        login({
          isAuthenticated: true,
          name: user.name,
          phone: user.phone,
          hospitalId: user.hospitalId,
          email: user.email,
          profileComplete: true,
          needsProfile: false
        });
        navigate("/patient-portal");
      } else {
        toast.error("Invalid credentials");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="identifier" className="text-sm font-medium">Hospital ID / Phone / Email</label>
        <Input
          id="identifier"
          name="identifier"
          placeholder="Enter your Hospital ID, Phone, or Email"
          value={passwordFormData.identifier}
          onChange={handlePasswordFormChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={passwordFormData.password}
          onChange={handlePasswordFormChange}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default PasswordLoginForm;
