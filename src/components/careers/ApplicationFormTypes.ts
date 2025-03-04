
export type FormData = {
  name: string;
  email: string;
  phone: string;
  experience: string;
  resumeUrl: string;
};

export type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  resume?: string;
  termsAccepted?: string;
  otp?: string;
};

// New type for saved application data
export interface SavedApplication {
  formData: FormData;
  selectedCategory: string;
  selectedPosition: string;
  lastUpdated: number; // timestamp
  otpVerified: boolean;
}

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (allow various formats)
export const PHONE_REGEX = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// Constants for localStorage
export const SAVED_APPLICATION_KEY = 'savedCareerApplication';

// Helper functions for saving and retrieving application data
export const saveApplicationToStorage = (data: SavedApplication): void => {
  localStorage.setItem(SAVED_APPLICATION_KEY, JSON.stringify(data));
};

export const getApplicationFromStorage = (): SavedApplication | null => {
  const savedData = localStorage.getItem(SAVED_APPLICATION_KEY);
  if (!savedData) return null;
  
  try {
    return JSON.parse(savedData) as SavedApplication;
  } catch (e) {
    console.error('Error parsing saved application data:', e);
    return null;
  }
};

export const clearSavedApplication = (): void => {
  localStorage.removeItem(SAVED_APPLICATION_KEY);
};
