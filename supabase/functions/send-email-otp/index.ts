
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
    const { email } = await req.json();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // TODO: Implement real email service integration here
    // For now, we'll just log it and return success
    console.log(`[PRODUCTION] Generated OTP ${otp} for email ${email}`);
    
    // In a real implementation, you would:
    // 1. Store the OTP in a database with an expiration time
    // 2. Send the OTP via email using a service like SendGrid
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        // Only include this in development/testing
        testOtp: otp
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email OTP:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send OTP" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
