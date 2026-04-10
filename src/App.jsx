import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Loader from './components/ui/Loader';

// Pages
import Home from './pages/Home';

// Style
import './index.css';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Show loader for at least 2.5 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Show loader if either Firebase is loading OR our minimum timer is running
  if (loading || showLoader) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#030712] text-red-500 p-8 text-center">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20 max-w-md">
          <h2 className="text-2xl font-black mb-4">Connection Error</h2>
          <p className="text-gray-400 font-medium mb-6">{error.message}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#030712] text-white selection:bg-blue-500/30">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            {/* Catch-all route to prevent blank screens on wrong paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
