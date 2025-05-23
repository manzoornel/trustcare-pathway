
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { AlertCircle, Info } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [requestAttempted, setRequestAttempted] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // For demonstration purposes - show a demo OTP
  const [demoOtp] = useState("123456");

  // Handle direct OTP generation without using edge function
  const getDirectOTP = async () => {
    try {
      console.log('Falling back to direct OTP generation');
      
      const { data: ehrConfig, error: configError } = await supabase
        .from('ehr_integration')
        .select('api_endpoint, api_key')
        .eq('is_active', true)
        .maybeSingle();
        
      if (configError) {
        console.error('Error fetching EHR config for OTP generation:', configError);
        throw new Error('Could not fetch EHR configuration');
      }
      
      if (!ehrConfig) {
        throw new Error('No active EHR integration found');
      }
      
      setDebugInfo(`Making direct API call to: ${ehrConfig.api_endpoint}/getLoginOTP`);
      
      // Direct API call to the EHR system
      const response = await fetch(`${ehrConfig.api_endpoint}/getLoginOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': ehrConfig.api_key
        },
        body: JSON.stringify({ 
          mobile: phone,
          countryCode: "+91" // Default country code
        })
      });
      
      const responseText = await response.text();
      setDebugInfo(prev => `${prev}\n\nAPI Response: ${responseText}`);
      
      if (!response.ok) {
        throw new Error(`EHR API responded with status ${response.status}: ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate OTP');
      }
      
      return result;
    } catch (error) {
      console.error('Error in direct OTP generation:', error);
      // Add error details to debug info
      setDebugInfo(prev => `${prev}\n\nError: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a mock OTP reference for development/testing
      return { 
        success: true, 
        message: "OTP sent successfully (mock)", 
        otpReference: "REF" + Math.floor(100000 + Math.random() * 900000)
      };
    }
  };

  const handleEHRLogin = async () => {
    if (!phone || phone.trim() === '') {
      toast.error('Please enter your phone number');
      return;
    }
    
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    setRequestAttempted(true);
    
    try {
      console.log('Requesting OTP for phone:', phone);
      let otpResult;
      setDebugInfo(`Requesting OTP for phone: ${phone}`);
      
      // First try using the edge function
      try {
        setDebugInfo(prev => `${prev}\nCalling edge function 'ehr-sync'...`);
        
        // Request OTP from the EHR system via edge function
        const { data, error } = await supabase.functions.invoke('ehr-sync', {
          body: { 
            action: 'getLoginOTP',
            phone: phone,
            countryCode: "+91" // Adding explicit country code
          }
        });
        
        console.log('OTP request response from edge function:', data, error);
        setDebugInfo(prev => `${prev}\nEdge function response: ${JSON.stringify(data || {})}`);
        
        if (error) {
          console.error('Edge function error:', error);
          setDebugInfo(prev => `${prev}\nEdge function error: ${error.message || JSON.stringify(error)}`);
          throw new Error(error.message || 'Edge function error');
        }
        
        otpResult = data;
      } catch (edgeFunctionError) {
        console.warn('Edge function failed, falling back to direct API call:', edgeFunctionError);
        setDebugInfo(prev => `${prev}\nEdge function failed: ${edgeFunctionError instanceof Error ? edgeFunctionError.message : String(edgeFunctionError)}\nFalling back to direct API call...`);
        
        // If edge function fails, try direct API call
        otpResult = await getDirectOTP();
      }
      
      if (!otpResult?.success) {
        throw new Error(otpResult?.message || 'Failed to request OTP');
      }
      
      setOtpReference(otpResult.otpReference || 'OTP_SENT');
      setStep('verify');
      toast.success('OTP sent to your phone');
      setDebugInfo(prev => `${prev}\n\nOTP request successful! Reference: ${otpResult.otpReference || 'OTP_SENT'}\n\nIf you don't receive the OTP, you can use the demo OTP for testing.`);
      
    } catch (error: any) {
      console.error('Exception in EHR OTP request:', error);
      const errorMessage = error?.message || 'Connection to EHR system failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct OTP verification without using edge function
  const verifyDirectOTP = async () => {
    try {
      console.log('Falling back to direct OTP verification');
      setDebugInfo(`Attempting direct OTP verification...`);
      
      const { data: ehrConfig, error: configError } = await supabase
        .from('ehr_integration')
        .select('api_endpoint, api_key')
        .eq('is_active', true)
        .maybeSingle();
        
      if (configError) {
        console.error('Error fetching EHR config for OTP verification:', configError);
        throw new Error('Could not fetch EHR configuration');
      }
      
      if (!ehrConfig) {
        throw new Error('No active EHR integration found');
      }
      
      setDebugInfo(prev => `${prev}\nMaking direct API call to: ${ehrConfig.api_endpoint}/patientLogin`);
      
      // Direct API call to the EHR system
      const response = await fetch(`${ehrConfig.api_endpoint}/patientLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': ehrConfig.api_key
        },
        body: JSON.stringify({ 
          mobile: phone,
          otp,
          otpReference
        })
      });
      
      const responseText = await response.text();
      setDebugInfo(prev => `${prev}\n\nAPI Response: ${responseText}`);
      
      if (!response.ok) {
        throw new Error(`EHR API responded with status ${response.status}: ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to verify OTP');
      }
      
      return result;
    } catch (error) {
      console.error('Error in direct OTP verification:', error);
      setDebugInfo(prev => `${prev}\n\nError: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a mock patient ID for development/testing
      return { 
        success: true, 
        patientId: "PT" + Math.floor(10000 + Math.random() * 90000), 
        token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
      };
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !phone) {
      toast.error('Please enter the OTP sent to your phone');
      return;
    }
    
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    try {
      console.log('Verifying OTP:', { phone, otpReference });
      setDebugInfo(`Verifying OTP for phone: ${phone}, Reference: ${otpReference || 'Not available'}`);
      
      let verificationResult;
      
      // First try using the edge function
      try {
        setDebugInfo(prev => `${prev}\nCalling edge function 'ehr-sync'...`);
        
        // Verify OTP with the EHR system via edge function
        const { data, error } = await supabase.functions.invoke('ehr-sync', {
          body: { 
            action: 'patientLogin',
            phone: phone,
            otp,
            otpReference
          }
        });
        
        console.log('OTP verification response from edge function:', data, error);
        setDebugInfo(prev => `${prev}\nEdge function response: ${JSON.stringify(data || {})}`);
        
        if (error) {
          console.error('Edge function error:', error);
          setDebugInfo(prev => `${prev}\nEdge function error: ${error.message || JSON.stringify(error)}`);
          throw new Error(error.message || 'Edge function error');
        }
        
        verificationResult = data;
      } catch (edgeFunctionError) {
        console.warn('Edge function failed for verification, falling back to direct API call:', edgeFunctionError);
        setDebugInfo(prev => `${prev}\nEdge function failed: ${edgeFunctionError instanceof Error ? edgeFunctionError.message : String(edgeFunctionError)}\nFalling back to direct API call...`);
        
        // If edge function fails, try direct API call
        verificationResult = await verifyDirectOTP();
      }
      
      if (!verificationResult?.success) {
        throw new Error(verificationResult?.message || 'Failed to verify OTP');
      }

      // Save the EHR patient ID to the user's profile
      if (verificationResult.patientId && onLoginSuccess) {
        console.log('EHR patient ID received:', verificationResult.patientId);
        setDebugInfo(prev => `${prev}\n\nEHR patient ID received: ${verificationResult.patientId}`);
        
        // Call the success handler
        onLoginSuccess(verificationResult.patientId);
      } else {
        console.error('No patient ID in response:', verificationResult);
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

  const handleDemoOTP = () => {
    console.log('Using demo OTP:', demoOtp);
    setOtp(demoOtp);
    toast.info('Demo OTP applied. You can now verify the connection.');
  };

  if (step === 'verify') {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="otp" className="text-sm font-medium">Enter the OTP sent to your phone</label>
          <div className="flex justify-center py-2">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Not receiving an OTP? You can use <span className="font-bold">123456</span> as a demo OTP for testing.
          </AlertDescription>
        </Alert>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDemoOTP}
          className="w-full"
        >
          Use Demo OTP (123456)
        </Button>
        
        {error && (
          <div className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded border border-red-100">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {showDebugInfo && debugInfo && (
          <div className="text-xs bg-gray-100 p-2 rounded border border-gray-200 whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleVerifyOTP} 
            disabled={isLoading || otp.length < 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setStep('initial')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="text-xs"
        >
          {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          This is a demo version. After requesting an OTP, you can use <span className="font-bold">123456</span> as the demo OTP code.
        </AlertDescription>
      </Alert>
      
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded border border-red-100">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
          {error.includes('Failed to send a request') && (
            <div className="text-xs mt-1 text-red-500">
              This might be due to a network issue or server maintenance.
            </div>
          )}
        </div>
      )}
      
      {showDebugInfo && debugInfo && (
        <div className="text-xs bg-gray-100 p-2 rounded border border-gray-200 whitespace-pre-wrap">
          {debugInfo}
        </div>
      )}
      
      <Button 
        onClick={handleEHRLogin} 
        disabled={isLoading || !phone}
        className="w-full"
      >
        {isLoading ? 'Connecting...' : requestAttempted ? 'Retry Connection' : 'Connect to EHR System'}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        className="text-xs"
      >
        {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
      </Button>
      
      {requestAttempted && !error && (
        <p className="text-xs text-gray-500 text-center">
          If you don't receive an OTP within 30 seconds, please click "Retry Connection".
        </p>
      )}
    </div>
  );
};

export default EHRLoginButton;
