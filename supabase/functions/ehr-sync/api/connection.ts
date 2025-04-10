
import { corsHeaders } from '../../_shared/cors-helpers.ts';
import { createSuccessResponse, createErrorResponse } from '../response-handlers.ts';

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
      console.error(`API responded with status ${response.status}:`, errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully connected to EHR API. Found', data.length, 'doctors');
    
    return createSuccessResponse({ 
      success: true, 
      message: 'Successfully connected to the EHR API',
      data: { doctors: data.length }
    });
  } catch (error) {
    console.error('Error testing EHR connection:', error);
    
    // We still return 200 as this is a test result, not an error
    return createSuccessResponse({ 
      success: false, 
      message: `Failed to connect to EHR API: ${error.message}`
    });
  }
}
