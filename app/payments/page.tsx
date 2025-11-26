import AdminLayout from '../components/AdminLayout';
import { Search, Filter, MoreVertical, Download, CreditCard } from 'lucide-react';

const payments = [
  { id: 1, invoice: 'INV-001', broker: 'Arjun Mehta', package: 'Professional Package', amount: 14999, date: '2025-11-20', status: 'Completed', method: 'UPI' },
  { id: 2, invoice: 'INV-002', broker: 'Kavya Iyer', package: 'Starter Package', amount: 4999, date: '2025-11-21', status: 'Completed', method: 'Net Banking' },
  { id: 3, invoice: 'INV-003', broker: 'Rohan Desai', package: 'Enterprise Package', amount: 39999, date: '2025-11-22', status: 'Pending', method: 'Bank Transfer' },
  { id: 4, invoice: 'INV-004', broker: 'Ananya Nair', package: 'Premium Package', amount: 24999, date: '2025-11-23', status: 'Completed', method: 'Debit Card' },
  { id: 5, invoice: 'INV-005', broker: 'Karan Kapoor', package: 'Professional Package', amount: 14999, date: '2025-11-24', status: 'Failed', method: 'Credit Card' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
};

export default function Payments() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payments</h1>
            <p className="text-slate-600 mt-1">Track and manage all transactions</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300">
            <Download size={20} />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <p className="text-slate-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-800">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <p className="text-slate-600 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">{payments.filter(p => p.status === 'Completed').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <p className="text-slate-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{payments.filter(p => p.status === 'Pending').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <p className="text-slate-600 text-sm mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-600">{payments.filter(p => p.status === 'Failed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Invoice</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Broker</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                          <CreditCard size={16} className="text-white" />
                        </div>
                        <span className="font-semibold text-slate-800">{payment.invoice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{payment.broker}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{payment.package}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">₹{payment.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{payment.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                        <MoreVertical size={18} className="text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
