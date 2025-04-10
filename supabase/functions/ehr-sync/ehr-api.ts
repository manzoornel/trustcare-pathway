
// Re-export all the functions from the API modules
export { testEhrConnection } from './api/connection.ts';
export { fetchEhrData, getMockEhrData } from './api/fetch-data.ts';
export type { EhrApiConfig, EhrData } from './api/types.ts';

// Export authentication services
export * from './api/data-services/auth-service.ts';

// Export individual data services
export * from './api/data-services/lab-service.ts';
export * from './api/data-services/medication-service.ts';
export * from './api/data-services/appointment-service.ts';
export * from './api/data-services/visit-service.ts';
export * from './api/data-services/patient-service.ts';
export * from './api/data-services/doctor-service.ts';
