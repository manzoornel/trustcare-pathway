
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
    const testUrl = `${config.api_endpoint}/health`;
    
    console.log(`Sending test request to: ${testUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': config.api_key
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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

      // Let's also test the patient lab reports endpoint which is critical for reports
      console.log(`Testing lab reports endpoint: ${config.api_endpoint}/fetchPatientLabReports`);
      
      let reportsEndpointStatus = "Not tested";
      let reportsResponseBody = "";
      
      try {
        const reportsTestResponse = await fetch(`${config.api_endpoint}/fetchPatientLabReports`, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'token': config.api_key
          },
          signal: AbortSignal.timeout(5000)
        });
        
        reportsEndpointStatus = `${reportsTestResponse.status} ${reportsTestResponse.statusText}`;
        reportsResponseBody = await reportsTestResponse.text();
      } catch (e) {
        console.error('Error testing reports endpoint:', e);
        reportsEndpointStatus = `Error: ${e instanceof Error ? e.message : String(e)}`;
      }

      // Let's also test the getLoginOTP endpoint which is critical for patient login
      console.log(`Testing OTP endpoint: ${config.api_endpoint}/getLoginOTP`);
      
      let otpEndpointStatus = "Not tested";
      let otpResponseBody = "";
      
      try {
        const otpTestResponse = await fetch(`${config.api_endpoint}/getLoginOTP`, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'token': config.api_key
          },
          signal: AbortSignal.timeout(5000)
        });
        
        otpEndpointStatus = `${otpTestResponse.status} ${otpTestResponse.statusText}`;
        otpResponseBody = await otpTestResponse.text();
      } catch (e) {
        console.error('Error testing OTP endpoint:', e);
        otpEndpointStatus = `Error: ${e instanceof Error ? e.message : String(e)}`;
      }

      const success = response.status < 500; // Consider anything but server error as "connected"
      
      return new Response(
        JSON.stringify({
          success: success,
          message: success 
            ? 'Successfully connected to EHR API' 
            : `Connection failed with status ${response.status}`,
          statusCode: response.status,
          responseBody: responseBody ? responseBody.substring(0, 500) : null,
          endpoints: {
            health: {
              url: testUrl,
              status: `${response.status} ${response.statusText}`,
              responseBody: responseBody.substring(0, 200)
            },
            fetchPatientLabReports: {
              url: `${config.api_endpoint}/fetchPatientLabReports`,
              status: reportsEndpointStatus,
              responseBody: reportsResponseBody.substring(0, 200)
            },
            getLoginOTP: {
              url: `${config.api_endpoint}/getLoginOTP`,
              status: otpEndpointStatus,
              responseBody: otpResponseBody.substring(0, 200)
            }
          },
          apiEndpoint: config.api_endpoint,
          apiKeyProvided: !!config.api_key
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          },
          status: success ? 200 : 400
        }
      );

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Network error testing connection:', fetchError);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `Connection failed: ${fetchError.message || 'Network error'}`,
          error: fetchError.message || 'Network error',
          details: 'API server may be unreachable or blocking requests',
          apiEndpoint: config.api_endpoint,
          apiKeyProvided: !!config.api_key
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
  } catch (error: any) {
    console.error('Error testing EHR connection:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Connection failed: ${error.message || 'Unknown error'}`,
        error: error.message || 'Unknown error',
        apiEndpoint: config.api_endpoint,
        apiKeyProvided: !!config.api_key
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
