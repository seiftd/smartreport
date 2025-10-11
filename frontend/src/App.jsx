import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import LandingPage from './components/LandingPage';
import PremiumLandingPage from './components/PremiumLandingPage';
import Dashboard from './components/Dashboard';
import PremiumDashboard from './components/PremiumDashboard';
import UntitledDashboard from './components/UntitledDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Always show landing page first, regardless of auth state
  const [showLandingFirst, setShowLandingFirst] = useState(true);

  useEffect(() => {
    // Check if user has explicitly chosen to go to dashboard
    const hasNavigatedToDashboard = sessionStorage.getItem('navigatedToDashboard');
    if (hasNavigatedToDashboard && user) {
      setShowLandingFirst(false);
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Routes>
          <Route 
            path="/" 
            element={showLandingFirst ? <PremiumLandingPage /> : (user ? <UntitledDashboard user={user} /> : <PremiumLandingPage />)} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <UntitledDashboard user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
