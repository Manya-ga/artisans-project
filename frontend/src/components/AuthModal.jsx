import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, Sparkles, ChevronRight } from 'lucide-react';

export default function AuthModal({ open, mode, onClose, onChangeMode }) {
  const navigate = useNavigate();
  const { signup, login, loginDemo } = useAuth();
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setAuthError('');
    if (!email || !password || (mode === 'signup' && !displayName)) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signup') {
        await signup({ email, password, displayName });
        onClose?.();
      } else {
        await login({ email, password });
        onClose?.();
      }
    } catch (e) {
      setAuthError(e?.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleDemoLogin() {
    setAuthError('');
    setBusy(true);
    try {
      await loginDemo();
      onClose?.();
    } catch (e) {
      setAuthError(e?.message || 'Demo login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[120] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose?.()}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 relative overflow-y-auto max-h-[90vh] custom-scrollbar"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Background */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60" />
            
            <div className="relative">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 text-pink-500 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Join the Community</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                  </h2>
                </div>
                <button
                  onClick={() => onClose?.()}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                )}

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    type="email"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-sm"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {authError && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    {authError}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <button
                  onClick={submit}
                  disabled={busy}
                  className="w-full btn-primary py-4 rounded-2xl text-lg font-black flex items-center justify-center gap-2 group"
                >
                  {busy ? 'Securing...' : mode === 'signup' ? 'Get Started' : 'Sign In'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {mode === 'login' && (
                  <button
                    onClick={handleDemoLogin}
                    disabled={busy}
                    className="w-full py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors border-2 border-transparent"
                  >
                    Try the Demo Experience
                  </button>
                )}
              </div>

              <div className="mt-10 text-center">
                {mode === 'signup' ? (
                  <p className="text-sm font-medium text-gray-500">
                    Already an artisan?{' '}
                    <button
                      className="text-pink-600 font-black hover:underline"
                      onClick={() => onChangeMode?.('login')}
                    >
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">
                    New to Artisan Connect?{' '}
                    <button
                      className="text-pink-600 font-black hover:underline"
                      onClick={() => onChangeMode?.('signup')}
                    >
                      Create account
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
