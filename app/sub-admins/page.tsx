'use client';

import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminAuth } from '../context/AuthContext';
import {
  CheckCircle,
  X,
  Mail,
  Phone,
  User,
  Lock,
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  CreditCard,
  Shield,
} from 'lucide-react';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

// These match what you store in allowedRoutes in Mongo
const AVAILABLE_ROUTES = [
  { key: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: '/leads', label: 'Leads', icon: Users },
  { key: '/brokers', label: 'Brokers', icon: Briefcase },
  { key: '/packages', label: 'Packages', icon: Package },
  { key: '/payments', label: 'Payments', icon: CreditCard },
  { key: '/sub-admins', label: 'Sub Admins', icon: Shield },
];

export default function SubAdminsPage() {
  const { user, token } = useAdminAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    allowedRoutes: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<null | { type: 'success' | 'error'; text: string }>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRoute = (routeKey: string) => {
    setFormData(prev => {
      const exists = prev.allowedRoutes.includes(routeKey);
      return {
        ...prev,
        allowedRoutes: exists
          ? prev.allowedRoutes.filter(r => r !== routeKey)
          : [...prev.allowedRoutes, routeKey],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Name, email and password are required' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseurl}/api/sub-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber || undefined,
          allowedRoutes: formData.allowedRoutes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to create sub admin',
        });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Sub admin created successfully',
      });

      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        allowedRoutes: [],
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Only super admin can see this page
  if (!user) {
    // AdminShell in parent layout will handle redirect to /admin-login
    return null;
  }

  if (user.role !== 'super-admin') {
    return (
      <AdminLayout>
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-lg font-semibold text-slate-800">
            You do not have permission to manage sub admins.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sub Admins</h1>
            <p className="text-slate-500 text-sm mt-1">
              Create new admin accounts and control what sections they can access.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border border-slate-200 p-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-indigo-600" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full name"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-indigo-600" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2 text-indigo-600" />
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+91..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Lock className="w-4 h-4 mr-2 text-indigo-600" />
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Choose a strong password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-black"
            />
          </div>

          {/* Allowed routes */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-indigo-600" />
              Allowed sections
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Select which menu items this admin can see on the sidebar.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {AVAILABLE_ROUTES.map(route => {
                const Icon = route.icon;
                const checked = formData.allowedRoutes.includes(route.key);
                return (
                  <button
                    key={route.key}
                    type="button"
                    onClick={() => toggleRoute(route.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                      checked
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{route.label}</span>
                    {checked && (
                      <CheckCircle className="w-4 h-4 ml-auto text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Create Sub Admin</span>
              </>
            )}
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mt-0.5" />
              ) : (
                <X className="w-4 h-4 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
