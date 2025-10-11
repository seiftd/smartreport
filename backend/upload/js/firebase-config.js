// Firebase Configuration for SmartReport Pro
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkrrYJZc2cSSuwovTaCHvksSYnRVOOFgs",
  authDomain: "smartreport-pro.firebaseapp.com",
  projectId: "smartreport-pro",
  storageBucket: "smartreport-pro.firebasestorage.app",
  messagingSenderId: "990789201953",
  appId: "1:990789201953:web:20b4c0b3a5610a4e61b360",
  measurementId: "G-B5KLV37LEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

class FirebaseAuth {
  constructor() {
    this.auth = auth;
    this.googleProvider = googleProvider;
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      // Get ID token for backend verification
      const idToken = await user.getIdToken();
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        },
        idToken,
        accessToken: token
      };
    } catch (error) {
      console.error('❌ Google sign-in failed:', error);
      throw new Error('Google sign-in failed: ' + error.message);
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw new Error('Sign out failed: ' + error.message);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Get ID token
  async getIdToken() {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }
}

// Create and export Firebase auth instance
const firebaseAuth = new FirebaseAuth();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseAuth;
} else {
  window.firebaseAuth = firebaseAuth;
}
