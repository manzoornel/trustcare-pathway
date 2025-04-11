
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
    const { phone } = await req.json();
    
    if (!phone || !/^\d{10}$/.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid phone number format" }),
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
    
    // Remove any existing OTPs for this phone
    await supabase
      .from('otps')
      .delete()
      .eq('phone', phone);
    
    // Insert new OTP
    const { error: insertError } = await supabase
      .from('otps')
      .insert([
        { 
          phone, 
          otp,
          expires_at: expiresAt.toISOString(),
          type: 'phone'
        }
      ]);
    
    if (insertError) {
      console.error("Error storing OTP:", insertError);
      throw new Error("Failed to store OTP");
    }
    
    // TODO: In production, integrate with an SMS service like Twilio
    // Example code for Twilio integration (commented out):
    /*
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
    
    await twilioClient.messages.create({
      body: `Your Doctor Uncle verification code is: ${otp}`,
      from: twilioPhoneNumber,
      to: "+1" + phone // Assuming US numbers, adjust as needed
    });
    */
    
    console.log(`[PRODUCTION] Generated OTP ${otp} for phone ${phone}`);
    
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
    console.error("Error sending phone OTP:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send OTP" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
