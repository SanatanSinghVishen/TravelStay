import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper (Simple)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please <a href="/login">Login</a> to view this page.</div>; // Simple fallback
  }
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings/new" element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
