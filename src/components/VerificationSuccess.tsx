
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface VerificationSuccessProps {
  phone?: string;
  email?: string;
  redirectUrl: string;
  redirectLabel: string;
  onRedirect?: () => void;
}

const VerificationSuccess = ({ 
  phone, 
  email, 
  redirectUrl, 
  redirectLabel,
  onRedirect 
}: VerificationSuccessProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
      
      <div className="space-y-2 text-gray-600">
        <p>Your contact information has been verified successfully.</p>
        {phone && <p>Phone Number: <span className="font-medium">{phone}</span></p>}
        {email && <p>Email: <span className="font-medium">{email}</span></p>}
      </div>
      
      {onRedirect ? (
        <Button onClick={onRedirect} className="mt-6">
          {redirectLabel}
        </Button>
      ) : (
        <Button asChild className="mt-6">
          <Link to={redirectUrl}>
            {redirectLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default VerificationSuccess;
