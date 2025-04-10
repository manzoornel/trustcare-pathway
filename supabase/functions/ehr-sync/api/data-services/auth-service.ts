
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
      body: JSON.stringify({ phone, countryCode })
    });
    
    if (!response.ok) {
      console.error(`Error generating OTP: ${response.status}`);
      return { success: false, error: `API responded with status ${response.status}` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Exception generating OTP:', error);
    return { success: false, error: 'Failed to generate OTP' };
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
      body: JSON.stringify({ phone, otp, otpReference })
    });
    
    if (!response.ok) {
      console.error(`Error authenticating patient: ${response.status}`);
      return { success: false, error: `API responded with status ${response.status}` };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Exception authenticating patient:', error);
    return { success: false, error: 'Failed to authenticate patient' };
  }
}

/**
 * Generate mock OTP response
 */
export function getMockOTPResponse(): any {
  return { 
    success: true, 
    message: "OTP sent successfully", 
    otpReference: "REF" + Math.floor(100000 + Math.random() * 900000)
  };
}

/**
 * Generate mock login response
 */
export function getMockLoginResponse(): any {
  return { 
    success: true, 
    patientId: "PT" + Math.floor(10000 + Math.random() * 90000), 
    token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
  };
}
