
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
    const { phone, otp } = await req.json();
    
    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Phone number and OTP are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Get the stored OTP for this phone
    const { data: otpData, error: fetchError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .eq('type', 'phone')
      .single();
    
    if (fetchError || !otpData) {
      console.error("Error fetching OTP:", fetchError);
      return new Response(
        JSON.stringify({ success: false, message: "No OTP found for this phone number" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Check if OTP has expired
    if (new Date(otpData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP has expired" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Check if OTP matches
    if (otpData.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Delete the used OTP
    await supabase
      .from('otps')
      .delete()
      .eq('phone', phone);
    
    console.log(`[PRODUCTION] Verified OTP for phone ${phone}`);
    
    return new Response(
      JSON.stringify({ success: true, message: "OTP verified successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying phone OTP:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: "Failed to verify OTP" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
