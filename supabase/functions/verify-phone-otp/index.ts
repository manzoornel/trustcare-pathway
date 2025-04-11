
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
        JSON.stringify({ success: false, message: "Phone and OTP are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Get stored OTP from database
    const { data: otpData, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .eq('type', 'phone')
      .single();
    
    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ success: false, message: "No valid OTP found for this phone number" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Check if OTP is expired
    const expiresAt = new Date(otpData.expires_at);
    const now = new Date();
    if (expiresAt < now) {
      await supabase.from('otps').delete().eq('id', otpData.id);
      
      return new Response(
        JSON.stringify({ success: false, message: "OTP has expired, please request a new one" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Verify OTP
    if (otpData.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // OTP is valid, delete it to prevent reuse
    await supabase.from('otps').delete().eq('id', otpData.id);
    
    // Find the user profile
    const { data: profile, error: profileError } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Phone number verified successfully",
        profile: profile || null
      }),
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
