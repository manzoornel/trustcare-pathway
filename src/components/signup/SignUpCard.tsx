
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpForm from "./SignUpForm";
import { SignUpFormData } from "@/utils/signupValidation";

interface SignUpCardProps {
  onSubmit: (formData: SignUpFormData) => Promise<void>;
  isLoading: boolean;
}

const SignUpCard: React.FC<SignUpCardProps> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new patient account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm onSubmit={onSubmit} isLoading={isLoading} />
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
              Login
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
