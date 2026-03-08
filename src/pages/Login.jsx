import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);

    // Demo login - bypass Firebase for now
    setTimeout(() => {
      const demoUser = {
        uid: 'demo_user_1',
        email: email,
        name: email.split('@')[0] || 'Manager',
        role: 'manager',
        storeId: 'store_1687',
      };
      setUser(demoUser);
      setLoading(false);
      navigate('/');
    }, 800);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      uid: 'demo_user_1',
      email: 'manager@pandaexpress.com',
      name: 'Bond',
      role: 'manager',
      storeId: 'store_1687',
    };
    setUser(demoUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      {/* Panda Logo Area */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <img src="/panda-icon.svg" alt="Panda" className="w-14 h-14" />
        </div>
        <h1 className="text-white text-2xl font-bold">Manager Hub</h1>
        <p className="text-white/70 text-sm mt-1">Panda Express Operations</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
        <p className="text-sm text-gray-500 mb-5">Access your manager dashboard</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="text-xs text-primary font-medium text-right w-full"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm active:bg-primary-dark disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Demo Login */}
        <button
          onClick={handleDemoLogin}
          className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold text-sm active:bg-red-50"
        >
          🐼 Demo Login (No Account Needed)
        </button>
      </div>

      <p className="text-white/50 text-xs mt-6 text-center">
        Panda Express Manager Hub v1.0<br />
        Internal Operations Tool
      </p>
    </div>
  );
}
