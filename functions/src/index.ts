import { initializeApp } from 'firebase-admin/app';
import * as logger from 'firebase-functions/logger';

// Initialize Firebase Admin
try {
  // In Firebase Functions, we can use environment variables or service account
  // For now, we'll use the default credentials that Firebase Functions provides
  initializeApp();
} catch (error) {
  logger.error('Error initializing Firebase Admin:', error);
  throw error;
}

// Export functions from their respective files
export { onSpreadsheetChange } from './onSpreadsheetChange';
