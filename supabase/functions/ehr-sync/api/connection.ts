
import { corsHeaders } from '../_shared/cors-helpers.ts';

/**
 * Test connection to the EHR API
 * @param config Configuration for the EHR API connection
 */
export async function testEhrConnection(config: any): Promise<Response> {
  try {
    console.log('Testing connection to EHR API at:', config.api_endpoint);
    
    // Try to fetch the list of doctors as a simple connection test
    const response = await fetch(`${config.api_endpoint}/listDoctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully connected to the EHR API',
        data: { doctors: data.length }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error testing EHR connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Failed to connect to EHR API: ${error.message}`
      }),
      { 
        status: 200,  // We still return 200 as this is a test result, not an error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
