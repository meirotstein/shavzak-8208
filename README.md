# Shavzak-8208 Firebase POC Project

A multi-repo Firebase project with Node.js backend and React frontend, featuring Google Authentication and Firestore integration.

## 🚀 Project Status: COMPLETED ✅

All requirements have been implemented:
- ✅ Monorepo structure with backend and frontend subrepos
- ✅ Node.js TypeScript backend with Firebase Admin SDK
- ✅ React TypeScript frontend with Firebase client SDK
- ✅ Google Authentication support
- ✅ Firestore integration with POC collection
- ✅ CI/CD pipelines with GitHub Actions
- ✅ Firebase Hosting configuration
- ✅ Comprehensive setup documentation

## 🏗️ Project Structure

```
shavzak-8208/
├── backend/                 # Node.js backend with Firebase Admin SDK
│   ├── src/
│   │   └── server.ts       # Express server with auth middleware
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── env.example         # Environment variables template
├── frontend/                # React frontend with Firebase client SDK
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Authentication context
│   │   ├── App.tsx         # Main app component
│   │   ├── firebase.ts     # Firebase configuration
│   │   └── index.tsx       # App entry point
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── env.example         # Environment variables template
├── shared-config/           # Shared Firebase configuration
│   ├── firebase-config.json # Admin SDK config template
│   └── firebase-client-config.json # Client config template
├── .github/workflows/       # CI/CD pipelines
│   ├── backend.yml         # Backend CI/CD
│   └── frontend.yml        # Frontend CI/CD
├── firebase.json            # Firebase project configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── SETUP.md                 # Comprehensive setup guide
└── README.md                # This file
```

## ✨ Features

- 🔐 **Google Authentication** - Secure sign-in with Google accounts
- 🔥 **Firestore Integration** - Real-time database with POC collection
- 🚀 **Node.js Backend** - Express API with Firebase Admin SDK
- ⚛️ **React Frontend** - Modern UI with TypeScript
- 🔄 **CI/CD Pipeline** - Automated testing and deployment
- 📱 **Responsive Design** - Mobile-friendly interface
- 🛡️ **Security** - Protected API endpoints and Firestore rules

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud account

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd shavzak-8208
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your Firebase service account details
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your Firebase client config
npm start
```

### 4. Firebase Setup
```bash
firebase login
firebase init
firebase deploy
```

## 📖 Detailed Setup

For complete setup instructions, see [SETUP.md](./SETUP.md)

## 🔧 Development

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **API Endpoints**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## 🚀 Deployment

### Backend
- Deploy to your preferred hosting service
- Update CORS origins for production
- Set production environment variables

### Frontend
- Build: `cd frontend && npm run build`
- Deploy: `firebase deploy --only hosting`

## 🔐 Authentication Flow

1. User visits the React app
2. Clicks "Sign in with Google"
3. Completes Google OAuth flow
4. Receives Firebase ID token
5. Token is sent with API requests
6. Backend verifies token with Firebase Admin SDK
7. Access granted to protected endpoints

## 📊 Firestore Structure

```
Collection: poc
└── Document: pocid
    └── Field: helloword (string)
        └── Value: "helloword content"
```

## 🛡️ Security

- All API endpoints require valid Firebase ID token
- Firestore rules restrict access to authenticated users
- CORS configured for development and production
- Rate limiting on API endpoints
- Environment variables for sensitive data

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Type checking
npm run type-check
```

## 📝 Environment Variables

### Backend (.env)
```bash
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
# ... more Firebase config
```

### Frontend (.env)
```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
# ... more Firebase config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check [SETUP.md](./SETUP.md) for troubleshooting
- Review Firebase Console logs
- Check GitHub Actions workflow runs
- Ensure all environment variables are set correctly

## 🎯 Next Steps

- [ ] Add real-time Firestore listeners
- [ ] Implement user roles and permissions
- [ ] Add comprehensive testing suite
- [ ] Set up monitoring and alerting
- [ ] Add more Firestore collections
- [ ] Implement data validation
- [ ] Add backup and recovery procedures
