import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get('/listings/my').then(r => setListings(Array.isArray(r.data) ? r.data.slice(0, 2) : [])).catch(() => {});
    api.get('/messages').then(r => setMessages(r.data?.slice(0, 3) || [])).catch(() => {});
  }, []);

  const totalListings = listings.length;
  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);

  return (
    <DashboardLayout role="owner">
      <div className="p-6 md:p-12 max-w-7xl mx-auto w-full flex-1">
        <div className="mb-10">
          <h1 className="font-h1 text-h1 text-on-background mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Arthur'}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Here is what is happening with your listings today.</p>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">list_alt</span>
              </div>
              <span className="text-secondary font-label-sm text-label-sm bg-secondary-container/20 px-2 py-1 rounded-full">+2 this week</span>
            </div>
            <p className="text-on-surface-variant font-label-md text-label-md">Total Active Listings</p>
            <h3 className="font-h2 text-h2 text-on-background">{totalListings || 12}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <span className="text-tertiary font-label-sm text-label-sm bg-tertiary-fixed/30 px-2 py-1 rounded-full">+15% vs last month</span>
            </div>
            <p className="text-on-surface-variant font-label-md text-label-md">Profile Views</p>
            <h3 className="font-h2 text-h2 text-on-background">{totalViews.toLocaleString() || '1,284'}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-on-secondary-container/10 flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">alternate_email</span>
              </div>
              <span className="text-error font-label-sm text-label-sm bg-error-container/40 px-2 py-1 rounded-full">{messages.filter(m => m.status === 'pending').length} Urgent</span>
            </div>
            <p className="text-on-surface-variant font-label-md text-label-md">New Inquiries</p>
            <h3 className="font-h2 text-h2 text-on-background">{messages.length || 24}</h3>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Listings */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-h3 text-h3 text-on-background">Active Listings</h2>
              <Link to="/listings" className="text-primary font-label-md hover:underline">View all listings</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.length > 0 ? listings.map(l => {
                const price = l.roomConfigs?.[0]?.priceMonthly || 0;
                return (
                  <div key={l._id} className="bg-white rounded-xl border border-outline-variant overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48">
                      <img alt={l.propertyName} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" src={l.images?.[0]} />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${l.availability === 'filling_fast' ? 'bg-tertiary' : 'bg-secondary'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${l.availability === 'filling_fast' ? 'text-tertiary' : 'text-secondary'}`}>
                          {l.availability === 'filling_fast' ? 'Filling Fast' : 'Available'}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-lg font-bold">
                        ${price.toLocaleString()}/mo
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-h3 text-[18px] text-on-background mb-1">{l.propertyName}</h4>
                      <p className="text-on-surface-variant text-sm mb-4">{l.address}</p>
                      <div className="flex gap-4 mb-6 text-slate-500">
                        {l.amenities?.slice(0, 3).map(a => (
                          <div key={a} className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">{a === 'High-speed WiFi' ? 'wifi' : a === 'Air Conditioning' ? 'ac_unit' : a === 'Smart Security' ? 'verified' : 'check_circle'}</span>
                            <span className="text-xs">{a.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to={`/add-listing`} className="py-2 border border-primary text-primary font-label-md rounded-lg hover:bg-primary-container/5 transition-colors text-center">Edit</Link>
                        <button className="py-2 bg-on-background text-white font-label-md rounded-lg hover:opacity-90 transition-opacity">Mark as Filled</button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-2 bg-white rounded-xl border border-outline-variant p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">home_work</span>
                  <p className="text-on-surface-variant mb-4">No listings yet.</p>
                  <Link to="/add-listing" className="px-6 py-3 bg-primary text-white rounded-lg font-label-md">Add Listing</Link>
                </div>
              )}
            </div>
          </section>

          {/* Recent Leads */}
          <section className="space-y-6">
            <h2 className="font-h3 text-h3 text-on-background">Recent Leads</h2>
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm divide-y divide-outline-variant">
              {messages.length > 0 ? messages.map(m => (
                <div key={m._id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                      {m.sender?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-label-md text-on-background truncate">{m.sender?.name}</p>
                        <span className="text-[10px] text-on-surface-variant">{new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-3 line-clamp-1 italic">"{m.content}"</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-primary/10 text-primary rounded text-[11px] font-bold hover:bg-primary hover:text-white transition-all">Reply</button>
                        <button className="px-2 py-1.5 border border-outline-variant rounded text-on-surface-variant hover:bg-slate-100 transition-all">
                          <span className="material-symbols-outlined text-[14px]">call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-on-surface-variant text-sm">No inquiries yet</div>
              )}
              <button className="w-full p-4 text-primary font-label-md hover:bg-indigo-50 transition-colors text-center">
                View All Inquiries
              </button>
            </div>

            {/* Boost CTA */}
            <div className="bg-primary p-6 rounded-xl text-on-primary">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined">auto_awesome</span>
                <p className="font-bold">Boost Visibility</p>
              </div>
              <p className="text-sm opacity-90 mb-6">Promoted listings get up to 3x more inquiries from students.</p>
              <button className="w-full py-2.5 bg-white text-primary font-bold rounded-lg hover:bg-on-primary-container transition-colors">
                Promote Listing
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
