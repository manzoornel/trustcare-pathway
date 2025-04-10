
import React, { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  value?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, value = "" }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle value updates from parent
  useEffect(() => {
    if (value) {
      const digits = value.split("").slice(0, length);
      const newOtp = [...Array(length).fill("")];
      digits.forEach((digit, idx) => {
        if (idx < length) {
          newOtp[idx] = digit;
        }
      });
      setOtp(newOtp);
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only accept digits
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Check if a full OTP has been entered
    const otpString = newOtp.join("");
    if (otpString.length === length) {
      onComplete(otpString);
    }
    
    // Move to next input if a digit was entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, length);
    
    if (digits.length) {
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (idx < length) {
          newOtp[idx] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus on appropriate input
      const focusIndex = Math.min(digits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      
      // Check if OTP is complete
      if (digits.length === length) {
        onComplete(digits.join(""));
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          maxLength={1}
          className="w-12 h-12 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus={index === 0 && !value}
        />
      ))}
    </div>
  );
};

export default OTPInput;
