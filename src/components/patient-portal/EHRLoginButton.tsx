
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface EHRLoginButtonProps {
  onLoginSuccess?: (ehrPatientId: string) => void;
}

const EHRLoginButton: React.FC<EHRLoginButtonProps> = ({ onLoginSuccess }) => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  const [otpReference, setOtpReference] = useState('');
  const [otp, setOtp] = useState('');

  const handleEHRLogin = async () => {
    if (!auth.phone) {
      toast.error('Please update your profile with a phone number first');
      return;
    }
    
    setIsLoading(true);
    try {
      // Request OTP from the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'getLoginOTP',
          phone: auth.phone
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data.message || 'Failed to request OTP');
      }
      
      setOtpReference(data.otpReference);
      setStep('verify');
      toast.success('OTP sent to your phone');
      
    } catch (error) {
      console.error('Error requesting EHR OTP:', error);
      toast.error('Failed to connect to EHR system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !auth.phone || !otpReference) {
      toast.error('Please enter the OTP sent to your phone');
      return;
    }
    
    setIsLoading(true);
    try {
      // Verify OTP with the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'patientLogin',
          phone: auth.phone,
          otp,
          otpReference
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data.message || 'Failed to verify OTP');
      }

      // Save the EHR patient ID to the user's profile
      if (data.patientId && onLoginSuccess) {
        await supabase
          .from('patient_profiles')
          .update({ ehr_patient_id: data.patientId })
          .eq('id', auth.userId);
          
        onLoginSuccess(data.patientId);
      }
      
      toast.success('Successfully connected to EHR system');
      setStep('initial');
      
    } catch (error) {
      console.error('Error verifying EHR OTP:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="px-3 py-2 border rounded-md"
            placeholder="Enter OTP from SMS"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button 
            onClick={handleVerifyOTP} 
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setStep('initial')}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleEHRLogin} 
      disabled={isLoading || !auth.phone}
      className="w-full"
    >
      {isLoading ? 'Connecting...' : 'Connect to EHR System'}
    </Button>
  );
};

export default EHRLoginButton;
