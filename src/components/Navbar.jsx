import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || (location.pathname === '/' && !user);

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-gray-900/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 transition-all">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">H</div>
        <span className="text-lg font-black tracking-tighter text-white">
          HackathonApp
        </span>
      </Link>
      <div className="flex gap-3 items-center">
        {!isLoginPage && (
          <div className="flex items-center gap-2 mr-4 bg-gray-800/50 p-1 rounded-xl border border-white/5">
            <Link to="/home" className="px-3 py-1.5 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-1.5 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">Dashboard</Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => auth.signOut()}
                  className="px-4 py-1.5 bg-red-500 text-white text-xs font-black rounded-lg shadow-lg shadow-red-500/20"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg shadow-lg shadow-blue-500/20"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
