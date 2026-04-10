import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login' || (location.pathname === '/' && !user);

  const scrollByAmount = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Create', path: '/create-event' },
    { name: 'Events', path: '/events' },
    { name: 'Analytics', path: '/analytics' },
  ] : [];

  return (
    <nav className="px-6 py-4 bg-gray-900/60 backdrop-blur-2xl sticky top-0 z-[100] border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link 
          to="/" 
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); }} 
          className="flex items-center gap-3 group relative z-50"
        >
          <Logo className="w-9 h-9 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-black tracking-tighter text-white">Eventify</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2 bg-gray-800/40 p-1 rounded-2xl border border-white/5">
          {!isLoginPage && (
            <button 
              onClick={() => scrollByAmount('features')} 
              className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors"
            >
              Features
            </button>
          )}
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                location.pathname === link.path ? 'text-blue-500 bg-blue-500/10 rounded-xl' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => auth.signOut()}
              className="px-5 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 ml-2"
            >
              Logout
            </motion.button>
          ) : !isLoginPage && (
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 ml-2"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        {!isLoginPage && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-gray-900/90 backdrop-blur-2xl border-b border-white/5"
          >
            <div className="flex flex-col gap-2 p-6">
              <button 
                onClick={() => scrollByAmount('features')}
                className="w-full text-left py-4 text-xl font-bold text-gray-300 border-b border-white/5"
              >
                Features
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-4 text-xl font-bold border-b border-white/5 ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { auth.signOut(); setIsOpen(false); }}
                  className="w-full py-4 text-left text-xl font-bold text-red-500"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-xl font-bold text-blue-500"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
