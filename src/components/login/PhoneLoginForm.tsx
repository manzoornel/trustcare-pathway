
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneLoginFormProps {
  phone: string;
  setPhone: (phone: string) => void;
  handlePhoneLogin: (e: React.FormEvent) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const PhoneLoginForm = ({ 
  phone, 
  setPhone, 
  handlePhoneLogin, 
  error, 
  loading 
}: PhoneLoginFormProps) => {
  return (
    <form onSubmit={handlePhoneLogin}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Enter your 10-digit phone number
          </p>
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </div>
    </form>
  );
};

export default PhoneLoginForm;
