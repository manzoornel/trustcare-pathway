
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    
    // Store OTP in database with expiration (30 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    // Remove any existing OTPs for this email
    await supabase
      .from('otps')
      .delete()
      .eq('email', email);
    
    // Insert new OTP
    const { error: insertError } = await supabase
      .from('otps')
      .insert([
        { 
          email, 
          otp,
          expires_at: expiresAt.toISOString(),
          type: 'email'
        }
      ]);
      
    if (insertError) {
      console.error("Error storing OTP:", insertError);
      throw new Error("Failed to store OTP");
    }
    
    // TODO: In production, integrate with an email service like SendGrid or Resend
    // Example code for SendGrid integration (commented out):
    /*
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sendgridApiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "noreply@docuncle.com", name: "Doctor Uncle Family Clinic" },
        subject: "Your Verification Code",
        content: [
          {
            type: "text/html",
            value: `<h1>Your verification code</h1><p>Use this code to verify your account: <strong>${otp}</strong></p>`,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("SendGrid error:", errorData);
      throw new Error("Failed to send email");
    }
    */
    
    console.log(`[PRODUCTION] Generated OTP ${otp} for email ${email}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        // Only include this for testing purposes
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
