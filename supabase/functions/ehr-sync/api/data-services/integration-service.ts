
import { EhrApiConfig } from "../types.ts";

/**
 * Activate EHR integration for a user
 */
export async function activateEHRIntegration(userId: string, supabase: any): Promise<boolean> {
  console.log(`Activating EHR integration for user: ${userId}`);
  
  try {
    // Check if there's already a config
    const { data: existingConfig, error: configError } = await supabase
      .from('ehr_integration')
      .select('id')
      .limit(1);
      
    if (configError) {
      console.error('Error checking existing EHR config:', configError);
      throw new Error(`Failed to check existing configuration: ${configError.message}`);
    }
    
    console.log('Existing config check result:', existingConfig);
    
    let result;
    if (existingConfig && existingConfig.length > 0) {
      // Update existing config using the security definer function
      console.log('Updating existing EHR config with ID:', existingConfig[0].id);
      
      const { data, error: updateError } = await supabase.rpc('activate_ehr_integration', {
        config_id: existingConfig[0].id,
        user_id: userId
      });
        
      if (updateError) {
        console.error('Error updating EHR config:', updateError);
        throw new Error(`Failed to update configuration: ${updateError.message}`);
      }
      
      result = { success: true };
    } else {
      // Create new config with default values using the security definer function
      console.log('Creating new EHR config');
      
      const { data, error: insertError } = await supabase.rpc('create_ehr_integration', {
        api_endpoint_param: 'http://103.99.205.192:8008/mirrors/Dr_Mirror/public',
        api_key_param: 'default-key',
        user_id: userId
      });
        
      if (insertError) {
        console.error('Error creating EHR config:', insertError);
        throw new Error(`Failed to create configuration: ${insertError.message}`);
      }
      
      result = { success: true };
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in activateEHRIntegration:', error);
    throw error;
  }
}
