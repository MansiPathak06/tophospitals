'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('zentrix_token');
    if (token) router.replace('/admindashboard');
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('zentrix_token', data.token);
      localStorage.setItem('zentrix_email', data.email);
      router.push('/admindashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-[10%] w-[400px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Floating accent dots */}
      <span className="absolute top-[22%] left-[18%] w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-pulse" />
      <span className="absolute top-[65%] left-[75%] w-1 h-1 rounded-full bg-emerald-400/50 animate-pulse delay-300" />
      <span className="absolute top-[78%] left-[25%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 animate-pulse delay-700" />

      {/* Login card */}
      <div className="relative w-full max-w-[420px] mx-4 bg-[#0d1425]/95 border border-white/10 rounded-2xl px-10 py-12 backdrop-blur-xl shadow-2xl shadow-black/40">

        {/* Card inner shine */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        {/* Brand section */}
        <div className="text-center mb-10 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            ⚕
          </div>
          <h1 className="text-[27px] text-slate-100 tracking-tight leading-none font-semibold">
            Zentrix
          </h1>
          <p className="mt-2 text-[13px] text-slate-500 tracking-wide">
            Admin Control Panel — Restricted Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 relative">

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="team.zentrix01@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/60 focus:bg-indigo-500/[0.04] focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/60 focus:bg-indigo-500/[0.04] focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-[15px] font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {loading && (
              <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl text-[13px] text-red-300">
              <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                ✕
              </span>
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <hr className="mt-8 border-white/[0.06]" />
        <p className="mt-4 text-center text-[11.5px] text-slate-700">
          Authorized personnel only · Zentrix Health Network
        </p>
      </div>
    </div>
  );
}