const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
    }

    console.log('✅ Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    throw error;
  }
};

// Verify Firebase ID token
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error.message);
    throw new Error('Invalid authentication token');
  }
};

// Get user by UID
const getUserByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Failed to get user:', error.message);
    throw new Error('User not found');
  }
};

// Create custom token for user
const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Failed to create custom token:', error.message);
    throw new Error('Failed to create custom token');
  }
};

// Set custom user claims
const setCustomUserClaims = async (uid, customClaims) => {
  try {
    await admin.auth().setCustomUserClaims(uid, customClaims);
    return true;
  } catch (error) {
    console.error('❌ Failed to set custom claims:', error.message);
    throw new Error('Failed to set user claims');
  }
};

module.exports = {
  initializeFirebase,
  verifyIdToken,
  getUserByUid,
  createCustomToken,
  setCustomUserClaims,
  admin
};
