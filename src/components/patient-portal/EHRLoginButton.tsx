
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';

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

  const handleEHRLogin = async () => {
    if (!phone || phone.trim() === '') {
      toast.error('Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      // Request OTP from the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'getLoginOTP',
          phone: phone
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data.message || 'Failed to request OTP');
      }
      
      setOtpReference(data.otpReference || 'OTP_SENT');
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
    if (!otp || !phone || !otpReference) {
      toast.error('Please enter the OTP sent to your phone');
      return;
    }
    
    setIsLoading(true);
    try {
      // Verify OTP with the EHR system
      const { data, error } = await supabase.functions.invoke('ehr-sync', {
        body: { 
          action: 'patientLogin',
          phone: phone,
          otp,
          otpReference
        }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data.message || 'Failed to verify OTP');
      }

      // Save the EHR patient ID to the user's profile
      if (data.patientId && onLoginSuccess) {
        // Update auth context if needed
        if (auth.userId) {
          await supabase
            .from('patient_profiles')
            .update({ hospital_id: data.patientId })
            .eq('id', auth.userId);
        }
          
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
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
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
    <div className="flex flex-col space-y-2">
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
      <Button 
        onClick={handleEHRLogin} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Connecting...' : 'Connect to EHR System'}
      </Button>
    </div>
  );
};

export default EHRLoginButton;
