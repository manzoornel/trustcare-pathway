
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
        
        <div className="pt-20 px-4 max-w-lg mx-auto">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Create Your Profile</h1>
            <p className="text-gray-600 mb-8 text-center">
              Get started with Doctor Uncle Family Clinic
            </p>
            
            <Alert variant="warning" className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Verified Registration Process</AlertTitle>
              <AlertDescription>
                We verify both your phone number and email to ensure the security of your medical information.
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
