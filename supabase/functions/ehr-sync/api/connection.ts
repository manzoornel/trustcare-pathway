
import { EhrApiConfig } from "./types.ts";
import { corsHeaders } from "../../_shared/cors-helpers.ts";

/**
 * Test the connection to the EHR API
 */
export async function testEhrConnection(config: EhrApiConfig) {
  console.log('Testing connection to EHR API');
  
  if (!config?.api_endpoint) {
    console.error('API endpoint is missing');
    return new Response(
      JSON.stringify({
        success: false,
        message: 'API endpoint is missing'
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 400
      }
    );
  }
  
  if (!config?.api_key) {
    console.error('API key is missing');
    return new Response(
      JSON.stringify({
        success: false,
        message: 'API key is missing'
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 400
      }
    );
  }

  try {
    console.log(`Testing connection to: ${config.api_endpoint}`);
    
    // Try to call a simple endpoint on the EHR API to test the connection
    // Most APIs have a health or ping endpoint
    // If your API doesn't have one, we'll use the first API endpoint we know
    const testUrl = `${config.api_endpoint}/health`;
    
    console.log(`Sending test request to: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      // Add a timeout to prevent hanging for too long
      signal: AbortSignal.timeout(10000)
    })
    .catch(error => {
      console.error('Network error testing connection:', error);
      throw new Error('Network error: API server may be unreachable');
    });
    
    console.log(`Test response status: ${response.status}`);
    
    // Even if the API returns an error response, the connection is working
    // if we get any response
    let responseBody = "";
    try {
      responseBody = await response.text();
      console.log('API response body:', responseBody.substring(0, 200));
    } catch (e) {
      console.error('Error reading response body:', e);
    }

    const success = response.status < 500; // Consider anything but server error as "connected"
    
    return new Response(
      JSON.stringify({
        success: success,
        message: success 
          ? 'Successfully connected to EHR API' 
          : `Connection failed with status ${response.status}`,
        statusCode: response.status,
        responseBody: responseBody ? responseBody.substring(0, 500) : null
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: success ? 200 : 400
      }
    );

  } catch (error: any) {
    console.error('Error testing EHR connection:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Connection failed: ${error.message || 'Unknown error'}`,
        error: error.message || 'Unknown error'
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 500
      }
    );
  }
}
