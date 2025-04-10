
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface EHRLoginButtonProps {
  onLoginSuccess?: (ehrPatientId: string) => void;
}

const EHRLoginButton: React.FC<EHRLoginButtonProps> = ({ onLoginSuccess }) => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  const [otpReference, setOtpReference] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState(auth.phone || '');
  const [error, setError] = useState<string | null>(null);

  const handleEHRLogin = async () => {
    if (!phone || phone.trim() === '') {
      toast.error('Please enter your phone number');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    try {
      console.log('Requesting OTP for phone:', phone);
      
      // Request OTP from the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'getLoginOTP',
          phone: phone
        }
      });
      
      console.log('OTP request response:', data, error);
      
      if (error || !data?.success) {
        const errorMessage = error?.message || data?.message || 'Failed to request OTP';
        console.error('OTP request failed:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      setOtpReference(data.otpReference || 'OTP_SENT');
      setStep('verify');
      toast.success('OTP sent to your phone');
      
    } catch (error: any) {
      console.error('Exception in EHR OTP request:', error);
      const errorMessage = error?.message || 'Connection to EHR system failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !phone || !otpReference) {
      toast.error('Please enter the OTP sent to your phone');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    try {
      console.log('Verifying OTP:', { phone, otpReference });
      
      // Verify OTP with the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'patientLogin',
          phone: phone,
          otp,
          otpReference
        }
      });
      
      console.log('OTP verification response:', data, error);
      
      if (error || !data?.success) {
        const errorMessage = error?.message || data?.message || 'Failed to verify OTP';
        console.error('OTP verification failed:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Save the EHR patient ID to the user's profile
      if (data.patientId && onLoginSuccess) {
        console.log('EHR patient ID received:', data.patientId);
        
        // Call the success handler
        onLoginSuccess(data.patientId);
      } else {
        console.error('No patient ID in response:', data);
        setError('No patient ID received from EHR system');
        toast.error('Failed to retrieve patient ID from EHR system');
        return;
      }
      
      toast.success('Successfully connected to EHR system');
      setStep('initial');
      setError(null);
      
    } catch (error: any) {
      console.error('Exception in EHR OTP verification:', error);
      const errorMessage = error?.message || 'Failed to verify OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-2">
          <label htmlFor="otp" className="text-sm font-medium">Enter the OTP sent to your phone</label>
          <div className="flex items-center space-x-2">
            <Input
              id="otp"
              type="text"
              className="px-3 py-2"
              placeholder="Enter OTP from SMS"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button 
              onClick={handleVerifyOTP} 
              disabled={isLoading || !otp}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => setStep('initial')}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <Input
          id="phone"
          type="tel"
          className="mb-2"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <Button 
        onClick={handleEHRLogin} 
        disabled={isLoading || !phone}
        className="w-full"
      >
        {isLoading ? 'Connecting...' : 'Connect to EHR System'}
      </Button>
    </div>
  );
};

export default EHRLoginButton;
