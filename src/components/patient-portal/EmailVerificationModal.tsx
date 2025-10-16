import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OTPInput from "@/components/OTPInput";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

type VerificationStep = "email" | "otp" | "success";

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onClose,
  defaultEmail = "",
}) => {
  const [step, setStep] = useState<VerificationStep>("email");
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("success");
      setTimeout(() => {
        onClose();
        // Reset state after modal closes
        setTimeout(() => {
          setStep("email");
          setOtp("");
        }, 300);
      }, 2000);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-9xl font-bold" style={{ color: "hsl(var(--color-primary))" }}>
            DU
          </div>
        </div>

        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "hsl(var(--color-primary))" }}
            >
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            Verify Your Email
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 space-y-6 py-4">
          {/* Step 1: Email Input */}
          {step === "email" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-center text-muted-foreground">
                Enter your email address to receive a verification code
              </p>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full h-12 text-base font-medium rounded-lg"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-accent)) 100%)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === "otp" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  We've sent a 6-digit code to
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-center block text-foreground font-medium">
                  Enter Verification Code
                </Label>
                <OTPInput length={6} onComplete={setOtp} value={otp} />
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 text-base font-medium rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-accent)) 100%)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="w-full text-sm"
                  style={{ color: "hsl(var(--color-primary))" }}
                >
                  Didn't receive code? Resend OTP
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="space-y-6 animate-fade-in text-center py-6">
              <div className="flex justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center animate-scale-in"
                  style={{ backgroundColor: "hsl(var(--color-success) / 0.1)" }}
                >
                  <CheckCircle2
                    className="w-12 h-12"
                    style={{ color: "hsl(var(--color-success))" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display font-semibold text-foreground">
                  Email Verified Successfully!
                </h3>
                <p className="text-muted-foreground">
                  Your email has been verified. You can now access all features.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
