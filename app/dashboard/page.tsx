import AdminLayout from '../components/AdminLayout';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const stats = [
  {
    name: 'Total Leads',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Active Brokers',
    value: '127',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Total Revenue',
    value: '₹45,231',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Active Packages',
    value: '18',
    change: '+4.3%',
    trend: 'up',
    icon: Package,
    color: 'from-orange-500 to-red-500',
  },
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm font-medium">{stat.name}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                      <span className="text-slate-500 text-xs">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Leads</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Lead #{1000 + i}</p>
                      <p className="text-sm text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Payments</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">₹{(Math.random() * 10000).toFixed(2)}</p>
                      <p className="text-sm text-slate-500">Payment #{5000 + i}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
