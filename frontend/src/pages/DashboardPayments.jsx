import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const demoTransactions = [
  { id: 'TXN-001', desc: 'Rent – Green Valley PG (March)', amount: 8000, type: 'debit', date: '2024-03-01', status: 'success', method: 'UPI' },
  { id: 'TXN-002', desc: 'Security Deposit – Green Valley PG', amount: 16000, type: 'debit', date: '2024-02-28', status: 'success', method: 'Bank Transfer' },
  { id: 'TXN-003', desc: 'Rent – Green Valley PG (February)', amount: 8000, type: 'debit', date: '2024-02-01', status: 'success', method: 'UPI' },
  { id: 'TXN-004', desc: 'Refund – Cancelled Booking', amount: 3000, type: 'credit', date: '2024-01-20', status: 'success', method: 'Bank Transfer' },
  { id: 'TXN-005', desc: 'Rent – Sunrise Residency (January)', amount: 9500, type: 'debit', date: '2024-01-01', status: 'failed', method: 'Card' },
];

const methodIcons = { UPI: 'account_balance_wallet', 'Bank Transfer': 'account_balance', Card: 'credit_card' };

export default function DashboardPayments({ role = 'owner' }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? demoTransactions : demoTransactions.filter(t => t.type === filter || t.status === filter);

  const totalPaid = demoTransactions.filter(t => t.type === 'debit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalReceived = demoTransactions.filter(t => t.type === 'credit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);

  return (
    <DashboardLayout role={role}>
      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Payments</h1>
          <p className="text-slate-500 text-sm">All your rent payments and financial transactions.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Paid</p>
            <p className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</p>
            <p className="text-xs opacity-70 mt-1">This year</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Refunds Received</p>
            <p className="text-3xl font-bold text-green-600">₹{totalReceived.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">This year</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Next Payment</p>
            <p className="text-3xl font-bold text-amber-500">₹8,000</p>
            <p className="text-xs text-slate-400 mt-1">Due on Apr 1, 2024</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[{ v: 'all', l: 'All' }, { v: 'debit', l: 'Paid' }, { v: 'credit', l: 'Refunds' }, { v: 'failed', l: 'Failed' }].map(f => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filter === f.v ? 'bg-indigo-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Transaction</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Method</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{t.desc}</p>
                      <p className="text-xs text-slate-400">{t.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="material-symbols-outlined text-[16px] text-indigo-400">{methodIcons[t.method] || 'payments'}</span>
                        {t.method}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${t.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold">
                      <span className={t.type === 'credit' ? 'text-green-600' : t.status === 'failed' ? 'text-red-500' : 'text-slate-800'}>
                        {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">payments</span>
              <p className="text-slate-400">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
