import { useState } from 'react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 -right-20 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-400/10 blur-[100px] rounded-full" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegistering ? 'reg' : 'login'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter">
               {isRegistering ? 'Get Started' : 'Sign In'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {isRegistering ? 'Create your workspace' : 'Welcome back, builder'}
            </p>
          </motion.div>
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 text-xs font-semibold text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            {isRegistering ? 'Register Now' : 'Continue'}
          </motion.button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span className="px-4 bg-transparent backdrop-blur-md">or</span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-600 dark:text-white shadow-sm transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Join with Google
        </motion.button>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-gray-400 text-sm font-medium hover:text-blue-500 transition-colors"
          >
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-4">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
