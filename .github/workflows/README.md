# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the project.

## 🚀 Available Workflows

### 1. **Firebase Functions CI/CD** (`firebase-functions.yml`)
- **Triggers**: Changes to `functions/**` directory
- **Purpose**: Automatically test, build, and deploy Firebase Functions
- **Deployment**: Only on push to `main` branch

### 2. **Frontend CI/CD** (`frontend.yml`)
- **Triggers**: Changes to `frontend/**` directory
- **Purpose**: Test and build React frontend
- **Deployment**: Only on push to `main` branch

### 3. **Backend CI/CD** (`backend.yml`)
- **Triggers**: Changes to `backend/**` directory
- **Purpose**: Test and validate backend code
- **Deployment**: Testing only (no deployment)

### 4. **Firebase Hosting** (`firebase-hosting-*.yml`)
- **Triggers**: Changes to frontend and hosting configuration
- **Purpose**: Deploy frontend to Firebase Hosting
- **Deployment**: On merge to `main` and PR previews

## 🔧 Setup Instructions

### One-time Setup

1. **Add GitHub Secrets** in your repository:
   - Go to `Settings` → `Secrets and variables` → `Actions`
   - Add these required secrets:

   ```
   FIREBASE_SERVICE_ACCOUNT: Your Firebase service account JSON (base64 encoded)
   FIREBASE_PROJECT_ID: Your Firebase project ID
   ```

2. **Get Firebase Service Account Key**:
   ```bash
   # Download from Firebase Console: Project Settings → Service Accounts
   # Generate new private key → Download JSON file
   
   # Encode for GitHub Secrets
   base64 -i firebase-service-account.json | tr -d '\n'
   ```

3. **Copy the base64 output** and paste it as the `FIREBASE_SERVICE_ACCOUNT` secret

### How It Works

#### **Firebase Functions Workflow:**
```
Push to functions/ → Test & Build → Deploy using service account (if main branch)
```

#### **Frontend Workflow:**
```
Push to frontend/ → Test & Build → Deploy to Hosting (if main branch)
```

#### **Backend Workflow:**
```
Push to backend/ → Test & Validate → No deployment
```

## 🎯 Workflow Triggers

### **Automatic Triggers:**
- ✅ **Push to `main`** → Full CI/CD pipeline (test, build, deploy)
- ✅ **Push to `develop`** → Testing only (no deployment)
- ✅ **Pull Request** → Testing and validation (no deployment)
- ✅ **Path-based triggers** → Only run when relevant files change

### **Manual Triggers:**
- You can manually trigger workflows from the Actions tab
- Useful for testing or emergency deployments

## 🔒 Security Features

- **Environment Protection**: Production deployments require approval
- **Secret Management**: Sensitive data stored in GitHub Secrets
- **Branch Protection**: Only `main` branch can deploy to production
- **Path-based Triggers**: Workflows only run when relevant files change

## 📊 Monitoring

### **View Workflow Runs:**
- Go to `Actions` tab in your repository
- See real-time status of all workflows
- View logs and debug any issues

### **Workflow Status Badges:**
Add these to your README.md for status visibility:
```markdown
![Firebase Functions](https://github.com/USER/REPO/workflows/Firebase%20Functions%20CI%2FCD/badge.svg)
![Frontend](https://github.com/USER/REPO/workflows/Frontend%20CI%2FCD/badge.svg)
```

## 🚨 Troubleshooting

### **Common Issues:**

1. **Workflow not triggering:**
   - Check file paths in workflow triggers
   - Ensure changes are in the correct directories

2. **Deployment failures:**
   - Verify GitHub Secrets are set correctly
   - Check Firebase project ID matches
   - Ensure service account has proper permissions

3. **Build failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### **Debug Workflows:**
- Enable debug logging in workflow files
- Add `echo` statements for debugging
- Check workflow run logs for detailed error messages

## 🎉 Benefits

- 🚀 **Zero manual deployment** after setup
- 🔒 **Production safety** with branch protection
- 🧪 **Automatic testing** on every change
- 📊 **Build validation** before deployment
- 🔄 **Consistent process** across all environments
- ⚡ **Fast feedback** on code changes
- 🛡️ **Security best practices** built-in

## 📝 Customization

### **Modify Workflows:**
- Edit `.yml` files to change triggers, steps, or conditions
- Add new jobs or modify existing ones
- Customize deployment strategies

### **Add New Workflows:**
- Create new `.yml` files in this directory
- Follow the existing pattern for consistency
- Test workflows in development branches first

### **Environment-specific Deployments:**
- Add staging environments
- Configure different deployment targets
- Set up environment-specific secrets
