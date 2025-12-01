'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, AdminUser } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const baseurl =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${baseurl}/api/sub-admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // backend response from your controller:
      // { message, token, data: { id, name, email, role, allowedRoutes } }
      const userData = data.data;

      const adminUser: AdminUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'sub-admin',
        token: data.token,
        allowedRoutes: userData.allowedRoutes || ['*'],
      };

      login(adminUser);

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Rentify Admin Login
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Super admin and admins login here.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-300 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Your password"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-700/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          First super admin you can insert directly in DB with role
          "super-admin" and allowedRoutes: ['*'] or at least
          ['/dashboard', '/sub-admins', '/leads', '/brokers', '/packages', '/payments'].
        </p>
      </div>
    </div>
  );
}
