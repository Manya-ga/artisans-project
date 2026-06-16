import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, Sparkles, ChevronRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Password strength calculator
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
  return { score, label: 'Strong', color: 'bg-green-400' };
}

export default function AuthModal({ open, mode, onClose, onChangeMode }) {
  const { signup, login, loginDemo } = useAuth();
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = mode === 'signup' ? getPasswordStrength(password) : null;

  // Reset state when modal opens/closes or mode changes
  function resetForm() {
    setAuthError('');
    setFieldErrors({});
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShowPassword(false);
  }

  function handleClose() {
    resetForm();
    onClose?.();
  }

  function handleChangeMode(m) {
    resetForm();
    onChangeMode?.(m);
  }

  // Validate fields and return errors map
  function validate() {
    const errors = {};
    if (mode === 'signup') {
      if (!displayName.trim()) errors.displayName = 'Name is required.';
      else if (displayName.trim().length < 2) errors.displayName = 'Name must be at least 2 characters.';
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return errors;
  }

  async function submit(e) {
    if (e) e.preventDefault();
    setAuthError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setBusy(true);

    try {
      if (mode === 'signup') {
        await signup({ email: email.trim(), password, displayName: displayName.trim() });
        handleClose();
      } else {
        await login({ email: email.trim(), password });
        handleClose();
      }
    } catch (e) {
      setAuthError(e?.message || 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDemoLogin() {
    setAuthError('');
    setBusy(true);
    try {
      await loginDemo();
      handleClose();
    } catch (e) {
      setAuthError(e?.message || 'Demo login failed. Please try again.');
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
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl p-6 sm:p-10 relative overflow-y-auto max-h-[100dvh] sm:max-h-[90vh] custom-scrollbar"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Background */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60" />

            <div className="relative">
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div>
                  <div className="flex items-center gap-2 text-pink-500 mb-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {mode === 'signup' ? 'Join the Community' : 'Welcome Back'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {mode === 'signup'
                      ? 'Start discovering unique handcrafted items'
                      : 'Access your Artisan Connect account'}
                  </p>
                </div>
                <button
                  type="button"
                  id="auth-modal-close"
                  onClick={handleClose}
                  className="p-2 -mr-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={submit} noValidate className="space-y-4">
                {/* Name field (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <div className={`relative group flex items-center border-2 rounded-2xl bg-gray-50 transition-all
                      ${fieldErrors.displayName
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-50 focus-within:bg-white focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-500/5'}`}
                    >
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                      <input
                        id="auth-display-name"
                        value={displayName}
                        onChange={(e) => { setDisplayName(e.target.value); setFieldErrors(f => ({ ...f, displayName: '' })); }}
                        placeholder="Your Full Name"
                        autoComplete="name"
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-transparent outline-none font-bold text-base text-gray-900 placeholder-gray-400"
                      />
                      {displayName.trim().length >= 2 && !fieldErrors.displayName && (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mr-4 shrink-0" />
                      )}
                    </div>
                    {fieldErrors.displayName && (
                      <p className="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.displayName}
                      </p>
                    )}
                  </div>
                )}

                {/* Email field */}
                <div>
                  <div className={`relative group flex items-center border-2 rounded-2xl bg-gray-50 transition-all
                    ${fieldErrors.email
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-50 focus-within:bg-white focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-500/5'}`}
                  >
                    <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      id="auth-email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: '' })); }}
                      placeholder="Email Address"
                      type="email"
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-transparent outline-none font-bold text-base text-gray-900 placeholder-gray-400"
                    />
                    {email && EMAIL_REGEX.test(email) && !fieldErrors.email && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-4 shrink-0" />
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <div className={`relative group flex items-center border-2 rounded-2xl bg-gray-50 transition-all
                    ${fieldErrors.password
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-50 focus-within:bg-white focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-500/5'}`}
                  >
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      id="auth-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setFieldErrors(f => ({ ...f, password: '' })); }}
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-transparent outline-none font-bold text-base text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 ml-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                    </p>
                  )}

                  {/* Password strength meter (signup only) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="mt-2 ml-1">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.color : 'bg-gray-100'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 font-medium">
                        Password strength: <span className={`font-bold ${
                          strength.score <= 1 ? 'text-red-500' :
                          strength.score <= 2 ? 'text-orange-500' :
                          strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Global error message */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </motion.div>
                )}

                {/* Submit button */}
                <div className="space-y-3 pt-2">
                  <button
                    id="auth-submit"
                    type="submit"
                    disabled={busy}
                    className="w-full btn-primary py-4 rounded-2xl text-lg font-black flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                      </span>
                    ) : (
                      <>
                        {mode === 'signup' ? 'Get Started' : 'Sign In'}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {mode === 'login' && (
                    <button
                      id="auth-demo-login"
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={busy}
                      className="w-full py-3.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors border-2 border-gray-100 hover:border-gray-200 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Try the Demo Experience
                    </button>
                  )}
                </div>
              </form>

              {/* Mode switcher */}
              <div className="mt-8 text-center">
                {mode === 'signup' ? (
                  <p className="text-sm font-medium text-gray-500">
                    Already have an account?{' '}
                    <button
                      id="auth-switch-to-login"
                      className="text-pink-600 font-black hover:underline"
                      onClick={() => handleChangeMode('login')}
                    >
                      Sign in here
                    </button>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">
                    New to Artisan Connect?{' '}
                    <button
                      id="auth-switch-to-signup"
                      className="text-pink-600 font-black hover:underline"
                      onClick={() => handleChangeMode('signup')}
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
