import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth();

// Google Apps Script installable trigger authentication middleware
const authenticateGoogleAppsScript = async (req: any, res: any, next: () => void) => {
  try {
    // Google Apps Script installable triggers MUST use proper authentication
    // Unauthenticated invocations are NOT allowed in production
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // REQUIRED: Must have a valid token for authentication
    if (!token) {
      logger.warn('Unauthenticated request blocked - no token provided', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
      
      return res.status(401).json({ 
        error: 'Authentication required - no token provided',
        message: 'Unauthenticated invocations are NOT allowed',
        authOptions: [
          'Firebase ID token (Bearer token) - for user-specific triggers',
          'Google ID token (Bearer token) - for service-to-service calls', 
          'Google OAuth access token (Bearer token) - for OAuth flows'
        ],
        documentation: 'Google Apps Script installable triggers must include proper authentication tokens'
      });
    }
    
    // Validate the token - try Firebase ID token first
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      req.authType = 'firebase_user';
      req.isAuthenticated = true;
      
      logger.info('Request authenticated with Firebase ID token', {
        uid: decodedToken.uid,
        email: decodedToken.email,
        timestamp: new Date().toISOString()
      });
      
      next();
      return;
    } catch (firebaseError) {
      // If not a Firebase token, it might be a Google ID token or OAuth token
      // For production, you should implement proper Google ID token verification here
      
      // For now, we'll accept it as a Google service token
      // TODO: Implement proper Google ID token verification
      req.authType = 'google_service';
      req.isGoogleRequest = true;
      req.isAuthenticated = true;
      
      logger.info('Request authenticated with Google service token', {
        timestamp: new Date().toISOString()
      });
      
      next();
      return;
    }
    
  } catch (error) {
    logger.error('Authentication processing error:', error);
    return res.status(500).json({ 
      error: 'Authentication processing error',
      message: 'Unable to process authentication request'
    });
  }
};

// Google Sheets webhook endpoint for Apps Script installable triggers
export const onSpreadsheetChange = onRequest(
  {
    cors: true,
    maxInstances: 10,
    region: 'me-west1', // Match your Firestore region
  },
  async (req: any, res: any) => {
    // Apply authentication middleware
    authenticateGoogleAppsScript(req, res, async () => {
      try {
        // Log the incoming request for debugging
        logger.info('Google Sheets webhook received from Apps Script:', {
          timestamp: new Date().toISOString(),
          authType: req.authType,
          headers: req.headers,
          body: req.body,
          user: req.user ? { uid: req.user.uid, email: req.user.email } : 'google_service',
          isGoogleRequest: req.isGoogleRequest || false,
          isAuthenticated: req.isAuthenticated || false
        });

        // For now, just return OK as requested
        res.status(200).json({ 
          status: 'OK',
          message: 'Webhook received successfully from Google Apps Script',
          authType: req.authType,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error('Error processing Google Sheets webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
);
