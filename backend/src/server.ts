import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
let serviceAccount: ServiceAccount;

try {
  // Read Firebase service account from JSON file
  const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_PATH || './firebase-service-account.json';
  const serviceAccountFile = fs.readFileSync(path.resolve(serviceAccountPath), 'utf8');
  serviceAccount = JSON.parse(serviceAccountFile) as ServiceAccount;
} catch (error) {
  console.error('Error reading Firebase service account file:', error);
  console.error('Please ensure the Firebase service account JSON file exists and is accessible');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Protected route to get POC data
app.get('/api/poc', authenticateToken, async (req, res) => {
  try {
    const docRef = db.collection('poc').doc('pocid');
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'POC document not found' });
    }
    
    res.json({ data: doc.data() });
  } catch (error) {
    console.error('Error fetching POC data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update POC data
app.put('/api/poc', authenticateToken, async (req, res) => {
  try {
    const { helloword } = req.body;
    
    if (!helloword) {
      return res.status(400).json({ error: 'helloword field is required' });
    }
    
    const docRef = db.collection('poc').doc('pocid');
    await docRef.set({ helloword }, { merge: true });
    
    res.json({ message: 'POC data updated successfully' });
  } catch (error) {
    console.error('Error updating POC data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile route
app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    res.json({
      uid,
      email,
      name,
      picture
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
 });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 API endpoints: http://localhost:${PORT}/api`);
});
