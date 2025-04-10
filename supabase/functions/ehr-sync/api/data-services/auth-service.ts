
import { EhrApiConfig } from "../types.ts";

/**
 * Generate OTP for patient login
 */
export async function getLoginOTP(phone: string, countryCode: string = "+91", config: EhrApiConfig): Promise<any> {
  console.log(`Generating OTP for patient login: ${phone} (${countryCode})`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/getLoginOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ mobile: phone }) // Using 'mobile' parameter as expected by API
    });
    
    if (!response.ok) {
      console.error(`Error generating OTP: ${response.status}`);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('OTP generation success response:', JSON.stringify(data).substring(0, 100) + '...');
    return data;
  } catch (error) {
    console.error('Exception generating OTP:', error);
    // Throwing the error so we can fall back to mock data in the edge function
    throw new Error('Failed to generate OTP: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Authenticate patient using OTP
 */
export async function patientLogin(phone: string, otp: string, otpReference: string, config: EhrApiConfig): Promise<any> {
  console.log(`Authenticating patient login: ${phone}`);
  
  try {
    const response = await fetch(`${config.api_endpoint}/patientLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': config.api_key
      },
      body: JSON.stringify({ 
        mobile: phone,  // Using 'mobile' parameter as expected by API
        otp
        // otpReference not needed according to API spec
      })
    });
    
    if (!response.ok) {
      console.error(`Error authenticating patient: ${response.status}`);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Patient login success response:', JSON.stringify(data).substring(0, 100) + '...');
    return data;
  } catch (error) {
    console.error('Exception authenticating patient:', error);
    // Throwing the error so we can fall back to mock data in the edge function
    throw new Error('Failed to authenticate patient: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Generate mock OTP response
 */
export function getMockOTPResponse(): any {
  const mockRef = "REF" + Math.floor(100000 + Math.random() * 900000);
  console.log('Generating mock OTP response with reference:', mockRef);
  
  return { 
    success: true, 
    message: "OTP sent successfully (mock)", 
    otpReference: mockRef
  };
}

/**
 * Generate mock login response
 */
export function getMockLoginResponse(): any {
  const mockPatientId = "PT" + Math.floor(10000 + Math.random() * 90000);
  const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2);
  
  console.log('Generating mock login response with patient ID:', mockPatientId);
  
  return { 
    success: true, 
    patientId: mockPatientId, 
    token: mockToken
  };
}
