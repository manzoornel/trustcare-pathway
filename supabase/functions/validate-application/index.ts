
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Types for form data validation
interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  resumeUrl?: string;
}

interface ValidationResponse {
  valid: boolean;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    experience?: string;
    resume?: string;
    termsAccepted?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request data
    const formData = await req.json() as FormData
    console.log('Validating form data:', formData)
    
    // Initialize validation response
    const validationResponse: ValidationResponse = {
      valid: true,
      errors: {}
    }
    
    // Validate name (required, min length 3)
    if (!formData.name || formData.name.trim().length < 3) {
      validationResponse.valid = false
      validationResponse.errors.name = 'Please enter your full name (at least 3 characters)'
    }
    
    // Validate email (required, format check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      validationResponse.valid = false
      validationResponse.errors.email = 'Please enter a valid email address'
    }
    
    // Validate phone (required, format check)
    const phoneRegex = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      validationResponse.valid = false
      validationResponse.errors.phone = 'Please enter a valid phone number'
    }
    
    // Validate experience (required, must be a number)
    if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      validationResponse.valid = false
      validationResponse.errors.experience = 'Please enter a valid number of years of experience'
    }
    
    // Log validation results
    console.log('Validation results:', validationResponse)
    
    return new Response(
      JSON.stringify(validationResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in validation:', error)
    
    return new Response(
      JSON.stringify({ valid: false, error: 'Server validation error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
