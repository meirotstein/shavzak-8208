# Firebase Functions - Google Sheets Webhook

This directory contains Firebase Functions (HTTP Gen2) for handling Google Sheets webhook requests from Google Apps Script installable triggers.

## 🚀 Function: `onSpreadsheetChange`

**Endpoint**: `/onSpreadsheetChange`  
**Method**: POST  
**Purpose**: Handle webhook requests from Google Sheets when changes occur

### Features

- **Multiple Authentication Methods**: Supports Firebase ID tokens, Google ID tokens, OAuth tokens, and Google service detection
- **Google Apps Script Integration**: Designed specifically for installable triggers
- **Comprehensive Logging**: Detailed request logging for debugging
- **CORS Enabled**: Cross-origin requests supported
- **Region Specific**: Configured for `me-west1` (matches your Firestore region)

### Authentication Options

1. **Firebase ID Token** - For user-specific triggers
2. **Google ID Token (JWT)** - For service-to-service calls
3. **Google OAuth Access Token** - For OAuth flows
4. **Google Service Detection** - Automatic detection of Google service requests
5. **Development Mode** - Special header for testing

### Usage

#### From Google Apps Script

```javascript
// Create installable trigger
function createInstallableTrigger() {
  ScriptApp.newTrigger('onSpreadsheetChange')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}

// Handle spreadsheet changes
function onSpreadsheetChange(e) {
  const url = 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/onSpreadsheetChange';
  
  // Option 1: With Firebase ID token (user authentication)
  const idToken = getFirebaseIdToken(); // Implement this function
  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      spreadsheetId: e.source.getId(),
      range: e.range.getA1Notation(),
      value: e.value,
      timestamp: new Date().toISOString()
    })
  });
  
  // Option 2: As Google service (automatic authentication)
  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      spreadsheetId: e.source.getId(),
      range: e.range.getA1Notation(),
      value: e.value,
      timestamp: new Date().toISOString()
    })
  });
  
  Logger.log('Response: ' + response.getContentText());
}
```

#### Testing with curl

```bash
# Development mode (no authentication required)
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/onSpreadsheetChange \
  -H "Content-Type: application/json" \
  -H "x-development-mode: true" \
  -d '{"test": "spreadsheet data"}'

# With Firebase ID token
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/onSpreadsheetChange \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{"test": "spreadsheet data"}'
```

### Response Format

```json
{
  "status": "OK",
  "message": "Webhook received successfully from Google Apps Script",
  "authType": "firebase_user",
  "timestamp": "2024-01-XX..."
}
```

### Development

```bash
# Install dependencies
cd functions
npm install

# Build TypeScript
npm run build

# Watch for changes
npm run build:watch

# Run locally (requires Firebase emulator)
npm run serve

# Deploy to Firebase
npm run deploy
```

### Configuration

The function is configured with:
- **CORS**: Enabled for cross-origin requests
- **Max Instances**: 10 concurrent executions
- **Region**: `me-west1` (matches your Firestore configuration)
- **Runtime**: Node.js 22

### Security

- **Authentication Required**: All requests must be authenticated
- **Google Service Detection**: Automatically identifies legitimate Google requests
- **Token Validation**: Firebase ID tokens are properly verified
- **Development Mode**: Special header for testing (disable in production)

### Next Steps

1. **Deploy the function**: `npm run deploy` or push to main branch for automatic deployment
2. **Set up Google Apps Script** with installable triggers
3. **Configure the webhook URL** to point to your deployed function
4. **Implement proper Google ID token verification** (currently simplified)
5. **Add rate limiting** and additional security measures
6. **Set up monitoring** and alerting

### Testing

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **API Endpoints**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

### Deployment

#### Manual Deployment
```bash
cd functions
npm run build
npm run deploy
```

#### Automated Deployment (Recommended)
The project includes GitHub Actions that automatically deploy when you push to the `main` branch:

1. **Push to `main`** → Automatic deployment
2. **Push to `develop`** → Testing only (no deployment)
3. **Create PR** → Validation and testing

**Required GitHub Secrets:**
- `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON (base64 encoded)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

**Get Firebase Service Account:**
```bash
# Download from Firebase Console: Project Settings → Service Accounts
# Generate new private key → Download JSON file

# Encode for GitHub Secrets
base64 -i firebase-service-account.json | tr -d '\n'
```

### Troubleshooting

- **Build errors**: Ensure Node.js 22+ is installed
- **Deployment issues**: Check Firebase CLI version and authentication
- **Authentication failures**: Verify token format and validity
- **CORS issues**: Check function configuration and CORS settings

### Files

- `src/index.ts` - Main function implementation
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint rules
- `.gitignore` - Git ignore patterns
- foo3