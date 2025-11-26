import AdminLayout from '../components/AdminLayout';
import { Search, Filter, MoreVertical, Check, X } from 'lucide-react';

const packages = [
  { id: 1, name: 'Starter Package', price: 4999, leads: 10, duration: '1 Month', features: ['Basic Support', '10 Leads', 'Email Notifications'], status: 'Active' },
  { id: 2, name: 'Professional Package', price: 14999, leads: 50, duration: '3 Months', features: ['Priority Support', '50 Leads', 'SMS + Email', 'Analytics'], status: 'Active' },
  { id: 3, name: 'Enterprise Package', price: 39999, leads: 200, duration: '6 Months', features: ['24/7 Support', '200 Leads', 'All Channels', 'Advanced Analytics', 'Custom Integration'], status: 'Active' },
  { id: 4, name: 'Premium Package', price: 24999, leads: 100, duration: '3 Months', features: ['Premium Support', '100 Leads', 'All Notifications', 'Reports'], status: 'Active' },
];

export default function Packages() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Packages</h1>
            <p className="text-slate-600 mt-1">Manage subscription packages</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300">
            + Create Package
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search packages..."
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <Check size={24} className="text-white" />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                  <MoreVertical size={18} className="text-slate-600" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-slate-800">₹{pkg.price.toLocaleString('en-IN')}</span>
                <span className="text-slate-500 text-sm">/{pkg.duration}</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{pkg.leads} Leads included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{pkg.duration} duration</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <p className="text-xs font-semibold text-slate-700 mb-3">FEATURES</p>
                <div className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={14} className="text-green-600" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300">
                Edit Package
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
