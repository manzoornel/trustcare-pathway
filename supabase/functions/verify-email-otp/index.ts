
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Parse request body
    const { email, otp } = await req.json();
    
    if (!email || !otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and OTP are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // TODO: Implement real OTP verification logic here
    // For now, we'll accept any OTP that's 6 digits for testing
    const isValid = /^\d{6}$/.test(otp);
    
    console.log(`[PRODUCTION] Verifying OTP ${otp} for email ${email}, valid: ${isValid}`);
    
    // In a real implementation, you would:
    // 1. Retrieve the stored OTP from database
    // 2. Check if it matches and hasn't expired
    // 3. Mark the email as verified if successful
    
    if (isValid) {
      return new Response(
        JSON.stringify({ success: true, message: "OTP verified successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying email OTP:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to verify OTP" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
