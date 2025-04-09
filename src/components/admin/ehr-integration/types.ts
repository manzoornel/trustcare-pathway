
export type EHRConfig = {
  id: string;
  api_endpoint: string;
  api_key: string;
  is_active: boolean;
  last_sync_time: string | null;
};

export type TestResult = {
  success: boolean;
  message: string;
} | null;
