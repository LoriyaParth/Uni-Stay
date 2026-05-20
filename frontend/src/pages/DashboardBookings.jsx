import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const demoBookings = [
  {
    id: 'BK-1001', property: 'Green Valley PG', address: 'Near IIT Gate, Powai', price: 8000,
    status: 'active', from: '2024-03-01', to: '2024-09-01', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80'
  },
  {
    id: 'BK-1002', property: 'Blue Ridge Hostel', address: 'MG Road, Pune', price: 6500,
    status: 'pending', from: '2024-04-10', to: '2024-10-10', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80'
  },
  {
    id: 'BK-1003', property: 'Sunrise Residency', address: 'Baner, Pune', price: 9500,
    status: 'completed', from: '2023-09-01', to: '2024-02-28', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80'
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DashboardBookings({ role = 'owner' }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? demoBookings : demoBookings.filter(b => b.status === filter);

  return (
    <DashboardLayout role={role}>
      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">My Bookings</h1>
          <p className="text-slate-500 text-sm">Track all your current and past accommodation bookings.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'active', 'pending', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {f === 'all' ? 'All Bookings' : f}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">home_work</span>
            <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} bookings found.</p>
            <Link to="/listings" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => (
              <div key={b.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-48 h-40 md:h-auto overflow-hidden flex-shrink-0">
                  <img src={b.image} alt={b.property} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">#{b.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{b.property}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>{b.address}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-indigo-400">calendar_today</span>
                        {new Date(b.from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-slate-300">→</span>
                      <span>{new Date(b.to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">₹{b.price.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">per month</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">
                        View Details
                      </button>
                      {b.status === 'active' && (
                        <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                          Contact Owner
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
