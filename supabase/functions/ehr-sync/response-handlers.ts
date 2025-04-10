
import { corsHeaders } from '../_shared/cors-helpers.ts'

/**
 * Create a standardized success response
 */
export function createSuccessResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: string, details?: any, status = 400) {
  return new Response(
    JSON.stringify({ error, details }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
