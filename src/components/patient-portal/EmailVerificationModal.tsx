import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OTPInput from "@/components/OTPInput";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import doctorUncleLogo from "@/assets/doctor-uncle-logo.jpg";

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
      toast.success("Email verified successfully!");
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
      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-2 shadow-2xl rounded-2xl overflow-hidden" style={{ borderColor: "hsl(var(--color-primary) / 0.3)" }}>
        {/* Logo Watermark */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <img src={doctorUncleLogo} alt="Doctor Uncle" className="h-24 w-24 rounded-full" />
        </div>

        <DialogHeader className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-accent)))" }}>
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            {step === "email" && "Verify Your Email"}
            {step === "otp" && "Enter OTP Code"}
            {step === "success" && "Successfully Verified!"}
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {step === "email" && "ഇമെയിൽ പരിശോധിക്കുക"}
            {step === "otp" && "OTP കോഡ് നൽകുക"}
            {step === "success" && "വിജയകരമായി പരിശോധിച്ചു"}
          </p>
        </DialogHeader>

        <div className="relative z-10 space-y-6 py-6">
          {/* Step 1: Email Input */}
          {step === "email" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address / ഇമെയിൽ വിലാസം
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary rounded-xl"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={!email || loading}
                className="w-full h-12 text-base font-semibold rounded-xl hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-accent)) 100%)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP Code
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === "otp" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center p-4 rounded-xl border" style={{ backgroundColor: "hsl(var(--color-primary) / 0.05)", borderColor: "hsl(var(--color-primary) / 0.2)" }}>
                <p className="text-sm text-muted-foreground mb-1">
                  Verification code sent to / സ്ഥിരീകരണ കോഡ് അയച്ചു
                </p>
                <p className="font-bold text-foreground text-lg">{email}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block text-center">
                  Enter 6-digit OTP / 6 അക്കങ്ങളുള്ള OTP നൽകുക
                </Label>
                <div className="flex justify-center">
                  <OTPInput
                    length={6}
                    value={otp}
                    onComplete={(value) => setOtp(value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || loading}
                  className="w-full h-12 text-base font-semibold rounded-xl hover:shadow-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-accent)) 100%)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Now
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <div className="text-center pt-2">
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm font-medium hover:underline disabled:opacity-50 transition-colors"
                    style={{ color: "hsl(var(--color-primary))" }}
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center space-y-6 py-8 animate-scale-in">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full flex items-center justify-center shadow-2xl animate-pulse-soft" style={{ backgroundColor: "hsl(var(--color-success) / 0.2)" }}>
                  <CheckCircle2 className="h-14 w-14" style={{ color: "hsl(var(--color-success))" }} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Email Verified Successfully!
                </h3>
                <p className="text-base font-semibold" style={{ color: "hsl(var(--color-success))" }}>
                  വിജയകരമായി പരിശോധിച്ചു
                </p>
                <p className="text-sm text-muted-foreground pt-2">
                  Your email has been verified. You now have full access to all portal features.
                </p>
              </div>
              <Button 
                onClick={onClose} 
                className="w-full h-12 text-base font-semibold rounded-xl hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--color-success)), hsl(152 80% 40%))",
                }}
              >
                Continue to Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
