
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

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone validation regex (allow various formats)
export const PHONE_REGEX = /^(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
