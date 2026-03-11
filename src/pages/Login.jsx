import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAppStore } from '../store/appStore';

export default function Login() {
  const navigate  = useNavigate();
  const { setUser } = useAppStore();

  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState('');

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/user-not-found':       return 'No account found with this email.';
      case 'auth/wrong-password':       return 'Incorrect password. Try again.';
      case 'auth/invalid-credential':   return 'Invalid email or password.';
      case 'auth/email-already-in-use': return 'This email is already registered. Sign in instead.';
      case 'auth/weak-password':        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':    return 'Too many attempts. Please wait a moment and try again.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const u    = cred.user;
      setUser({
        uid:     u.uid,
        email:   u.email,
        name:    u.displayName || name || u.email.split('@')[0],
        role:    'manager',
        storeId: 'store_1687',
      });
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email || !password || !name) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const u    = cred.user;
      setUser({
        uid:     u.uid,
        email:   u.email,
        name:    name.trim(),
        role:    'manager',
        storeId: 'store_1687',
      });
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ───────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    setError(''); setInfo('');
    if (!email) { setError('Enter your email first, then tap Forgot Password.'); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(friendlyError(err.code));
    }
  };

  // ── Demo Login (no account needed) ───────────────────────────────────────
  const handleDemoLogin = () => {
    setUser({ uid: 'demo_user', email: 'demo@px1687.com', name: 'Bond', role: 'manager', storeId: 'store_1687' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <img src="/panda-icon-192.png" alt="Panda Express" className="w-14 h-14 object-contain" />
        </div>
        <h1 className="text-white text-2xl font-bold">Manager Hub</h1>
        <p className="text-white/70 text-sm mt-1">Panda Express #1687 Operations</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {mode === 'login' ? 'Access your manager dashboard' : 'Register your manager account'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-green-50 text-green-700 text-sm px-3 py-2.5 rounded-xl mb-4 border border-green-100">
            {info}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Your Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                placeholder="Bond W."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <button type="button" onClick={handleForgotPassword}
              className="text-xs text-primary font-medium text-right w-full hover:underline">
              Forgot Password?
            </button>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-70 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setInfo(''); }}
            className="text-primary font-semibold hover:underline">
            {mode === 'login' ? 'Create one' : 'Sign In'}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-100"/>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100"/>
        </div>

        {/* Demo Login */}
        <button onClick={handleDemoLogin}
          className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
          🐼 Demo Login (No Account Needed)
        </button>
      </div>

      <p className="text-white/50 text-xs mt-6 text-center">
        Panda Express Manager Hub · Store #1687<br/>Internal Operations Tool
      </p>
    </div>
  );
}
