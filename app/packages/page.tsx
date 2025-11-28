
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import {
  Search,
  Filter,
  Check,
  Trash2,
  Edit3,
  Plus,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000';

type LeadPackage = {
  _id: string;
  key: string;
  name: string;
  leadsCount: number;
  price: number;
  durationLabel: string;
  features: string[];
  isActive: boolean;
  popular: boolean;
  sortOrder: number;
  bgClass?: string;
  gradientClass?: string;
  iconBgClass?: string;
  iconKey?: string;
  currency: string;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<LeadPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/lead-packages`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch packages');
      }

      setPackages(json.data || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      'Are you sure you want to deactivate this package?'
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/lead-packages/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete package');
      }

      setPackages(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete package');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const term = searchTerm.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(term) ||
      pkg.key.toLowerCase().includes(term) ||
      String(pkg.price).includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Packages</h1>
            <p className="text-slate-600 mt-1">
              Manage lead packages
            </p>
          </div>
          <Link
            href="/packages/addPackage"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
          >
            <Plus size={18} />
            Add New Package
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search packages by name, key or price..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-slate-500 py-10 text-sm">
            Loading packages...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map(pkg => (
              <div
                key={pkg._id}
                className={`rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
                  pkg.bgClass || 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${
                      pkg.gradientClass || 'from-indigo-500 to-purple-500'
                    } group-hover:scale-110 transition-transform duration-300 ${
                      pkg.iconBgClass || ''
                    }`}
                  >
                    <Check size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    {/* <Link
                      href={`/packages/${pkg._id}`}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      title="Edit package"
                    >
                      <Edit3 size={18} className="text-slate-600" />
                    </Link> */}
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Deactivate package"
                      disabled={deletingId === pkg._id}
                    >
                      {deletingId === pkg._id ? (
                        <span className="text-xs text-red-500">
                          ...
                        </span>
                      ) : (
                        <Trash2 size={18} className="text-red-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-500">
                    KEY: {pkg.key}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {pkg.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-800">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-500 text-sm">
                    /{pkg.durationLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  {pkg.leadsCount} leads • sort {pkg.sortOrder}
                </p>

                <div className="border-t border-slate-200 pt-4 mb-4">
                  <p className="text-xs font-semibold text-slate-700 mb-3">
                    FEATURES
                  </p>
                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {pkg.features?.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                      >
                        <Check
                          size={14}
                          className="text-green-600"
                        />
                        <span className="text-sm text-slate-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/packages/${pkg._id}`}
                  className="w-full inline-flex justify-center py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                >
                  Edit Package
                </Link>
              </div>
            ))}

            {filteredPackages.length === 0 && (
              <div className="col-span-full text-center text-slate-500 text-sm py-10">
                No packages found.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
