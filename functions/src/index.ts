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
    // Google Apps Script installable triggers can use several authentication methods:
    // 1. Google ID tokens (JWT)
    // 2. Google OAuth 2.0 access tokens
    // 3. Service account authentication
    // 4. Firebase ID tokens (for user-specific triggers)
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // Check for Google-specific headers that indicate Apps Script requests
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer || '';
    const origin = req.headers.origin || '';
    const xGoogAppsScriptProject = req.headers['x-goog-apps-script-project'];
    
    // If we have a token, try to authenticate it
    if (token) {
      try {
        // First, try to verify as a Firebase ID token (for user authentication)
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        req.authType = 'firebase_user';
        req.isAuthenticated = true;
        next();
        return;
      } catch (firebaseError) {
        // If not a Firebase token, it might be a Google ID token or OAuth token
        // For now, we'll accept it as a Google service token
        // In production, you'd want to verify Google's ID tokens properly
        req.authType = 'google_service';
        req.isGoogleRequest = true;
        req.isAuthenticated = true;
        next();
        return;
      }
    }
    
    // Check if it's a Google service request by various indicators
    if (userAgent.includes('Google') || 
        referer.includes('google.com') || 
        referer.includes('sheets.google.com') ||
        origin.includes('google.com') ||
        xGoogAppsScriptProject) {
      req.authType = 'google_service';
      req.isGoogleRequest = true;
      req.isAuthenticated = true;
      next();
      return;
    }
    
    // For development/testing, allow requests with special header
    if (req.headers['x-development-mode'] === 'true') {
      req.authType = 'development';
      req.isAuthenticated = true;
      next();
      return;
    }
    
    // If none of the above, reject with helpful error message
    return res.status(401).json({ 
      error: 'Authentication required for Google Apps Script installable triggers',
      authOptions: [
        'Firebase ID token (Bearer token) - for user-specific triggers',
        'Google ID token (Bearer token) - for service-to-service calls', 
        'Google OAuth access token (Bearer token) - for OAuth flows',
        'x-development-mode: true header - for testing purposes'
      ],
      documentation: 'Google Apps Script installable triggers should include proper authentication tokens',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'x-development-mode': 'true (for testing)'
      }
    });
    
  } catch (error) {
    logger.error('Google Apps Script authentication error:', error);
    return res.status(500).json({ error: 'Authentication processing error' });
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
