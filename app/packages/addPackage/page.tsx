


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

type FormState = {
  key: string;
  name: string;
  leadsCount: number | string;
  price: number | string;
  durationLabel: string;
  sortOrder: number | string;
  popular: boolean;
  isActive: boolean;
  bgClass: string;
  gradientClass: string;
  iconBgClass: string;
  iconKey: string;
  features: string[];
};

export default function NewPackagePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    key: '',
    name: '',
    leadsCount: 0,
    price: 0,
    durationLabel: '',
    sortOrder: 0,
    popular: false,
    isActive: true,
    bgClass: 'bg-blue-50',
    gradientClass: 'from-blue-500 to-blue-600',
    iconBgClass: 'bg-blue-500',
    iconKey: 'package',
    features: [''],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setForm(prev => {
      const next = [...prev.features];
      next[index] = value;
      return { ...prev, features: next };
    });
  };

  const addFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => {
      const next = [...prev.features];
      next.splice(index, 1);
      return {
        ...prev,
        features: next.length ? next : [''],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      key: form.key.trim(),
      name: form.name.trim(),
      leadsCount: Number(form.leadsCount),
      price: Number(form.price),
      currency: 'INR', // fixed
      durationLabel: form.durationLabel.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      popular: form.popular,
      isActive: form.isActive,
      bgClass: form.bgClass.trim(),
      gradientClass: form.gradientClass.trim(),
      iconBgClass: form.iconBgClass.trim(),
      iconKey: form.iconKey.trim() || 'package',
      features: form.features
        .map(f => f.trim())
        .filter(Boolean),
    };

    if (!payload.key || !payload.name) {
      setError('Key and name are required');
      return;
    }

    if (!payload.features.length) {
      setError('Add at least one feature');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/api/lead-packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create package');
      }

      router.push('/packages');
    } catch (err: any) {
      setError(err.message || 'Failed to create package');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6 text-black">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/packages')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
          >
            <ArrowLeft size={18} />
            Back to packages
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Create Package
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 space-y-6"
        >
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Main fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* key */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Key
              </label>
              <input
                type="text"
                value={form.key}
                onChange={e => handleChange('key', e.target.value)}
                placeholder="basic, pro, enterprise"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Basic Lead Pack"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* leadsCount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Leads count
              </label>
              <input
                type="number"
                value={form.leadsCount}
                onChange={e => handleChange('leadsCount', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price (INR)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* durationLabel */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duration label
              </label>
              <input
                type="text"
                value={form.durationLabel}
                onChange={e =>
                  handleChange('durationLabel', e.target.value)
                }
                placeholder="30 days, 3 months"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* sortOrder */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sort order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={e => handleChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                Lower number appears first
              </p>
            </div>

            {/* popular */}
            <div className="flex items-center gap-2 mt-6">
              <input
                id="popular"
                type="checkbox"
                checked={form.popular}
                onChange={e => handleChange('popular', e.target.checked)}
                className="rounded border-slate-300"
              />
              <label
                htmlFor="popular"
                className="text-sm text-slate-700"
              >
                Mark as popular
              </label>
            </div>

            {/* isActive */}
            <div className="flex items-center gap-2 mt-6">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={e => handleChange('isActive', e.target.checked)}
                className="rounded border-slate-300"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-slate-700"
              >
                Active
              </label>
            </div>
          </div>

          {/* UI classes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* bgClass */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Background class
              </label>
              <input
                type="text"
                value={form.bgClass}
                onChange={e => handleChange('bgClass', e.target.value)}
                placeholder="bg-blue-50"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* gradientClass */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gradient class
              </label>
              <input
                type="text"
                value={form.gradientClass}
                onChange={e =>
                  handleChange('gradientClass', e.target.value)
                }
                placeholder="from-blue-500 to-blue-600"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* iconBgClass */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Icon background class
              </label>
              <input
                type="text"
                value={form.iconBgClass}
                onChange={e =>
                  handleChange('iconBgClass', e.target.value)
                }
                placeholder="bg-blue-500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* iconKey */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Icon key
              </label>
              <input
                type="text"
                value={form.iconKey}
                onChange={e => handleChange('iconKey', e.target.value)}
                placeholder="package"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* features array */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Plus size={12} />
                Add feature
              </button>
            </div>

            <div className="space-y-2">
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={feature}
                    onChange={e =>
                      handleFeatureChange(index, e.target.value)
                    }
                    placeholder="Feature text"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Create package'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
