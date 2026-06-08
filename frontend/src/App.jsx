import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import { useAuth } from './context/AuthContext';
import api from './lib/axios';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Wrapper (Simple)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please <a href="/login">Login</a> to view this page.</div>;
  }
  return children;
};

// Banner displayed while Render cold-starts the backend
const WakeUpBanner = ({ onDismiss }) => (
  <div style={{
    background: '#fff3cd',
    color: '#856404',
    borderBottom: '1px solid #ffc107',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    gap: '12px',
  }}>
    <span>
      ⏳ <strong>Server is waking up…</strong> The backend is hosted on Render's free tier and may take up to 60 seconds to start. Please wait.
    </span>
    <button
      onClick={onDismiss}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: '#856404' }}
      aria-label="Dismiss"
    >
      ✕
    </button>
  </div>
);

function App() {
  const [serverAwake, setServerAwake] = useState(true);   // assume awake until proven slow
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    let timer;
    let resolved = false;

    // Show banner only if the server hasn't responded within 1 second
    timer = setTimeout(() => {
      if (!resolved) setBannerVisible(true);
    }, 1000);

    api.get('/health')
      .then(() => {
        resolved = true;
        clearTimeout(timer);
        setBannerVisible(false);
        setServerAwake(true);
      })
      .catch(() => {
        resolved = true;
        clearTimeout(timer);
        setBannerVisible(false); // hide banner even on error; not much we can do
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {bannerVisible && <WakeUpBanner onDismiss={() => setBannerVisible(false)} />}
      <Navbar />
      <Toaster position="top-right" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/listings" element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
          <Route path="/signup" element={<ErrorBoundary><Signup /></ErrorBoundary>} />
          <Route path="/listings/new" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/listings/:id" element={<ErrorBoundary><ListingDetail /></ErrorBoundary>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
