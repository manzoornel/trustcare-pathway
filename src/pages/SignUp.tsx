
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignUpCard from "@/components/signup/SignUpCard";
import { useSignUp } from "@/hooks/useSignUp";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const SignUp = () => {
  const { isLoading, handleSignUp } = useSignUp();

  return (
    <>
      <Helmet>
        <title>Patient Sign Up | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Sign up to create your patient account at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-md mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Patient Sign Up</h1>
            <p className="text-gray-600 mb-8 text-center">
              Create your patient account to access your medical records
            </p>
            
            <Alert variant="warning" className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Email verification required</AlertTitle>
              <AlertDescription>
                After signing up, you'll need to verify your email address to activate your account.
              </AlertDescription>
            </Alert>
            
            <SignUpCard 
              onSubmit={handleSignUp}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default SignUp;
