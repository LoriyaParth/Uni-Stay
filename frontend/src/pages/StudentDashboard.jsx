import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get('/favorites').then(r => setFavorites(r.data?.slice(0,2) || [])).catch(() => {});
    api.get('/messages').then(r => setMessages(r.data?.slice(0,3) || [])).catch(() => {});
  }, []);

  const statusColors = { responded: 'bg-green-50 text-green-700', pending: 'bg-amber-50 text-amber-700', resolved: 'bg-indigo-50 text-indigo-700' };
  const statusDot = { responded: 'bg-green-500', pending: 'bg-amber-500', resolved: 'bg-indigo-500' };
  const contactIcons = ['person', 'apartment', 'account_balance'];
  const contactBgs = ['bg-indigo-100 text-indigo-600', 'bg-orange-100 text-orange-600', 'bg-slate-100 text-slate-600'];

  return (
    <DashboardLayout role="student">
      <div className="p-6 md:p-[64px] flex-1 max-w-[1280px] mx-auto w-full">
        <div className="mb-[40px]">
          <h2 className="font-h1 text-h1 text-on-surface mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Alex'}</h2>
          <p className="text-body-lg text-on-surface-variant">You have {messages.filter(m => m.status === 'pending').length} unread messages and new properties matching your filters.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          {/* Saved Favorites */}
          <section className="lg:col-span-2 space-y-[24px]">
            <div className="flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-surface">Saved Favorites</h3>
              <Link to="/favorites" className="text-primary font-label-md hover:underline decoration-indigo-500 underline-offset-4">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {favorites.length > 0 ? favorites.map(l => {
                const price = l.roomConfigs?.[0]?.priceMonthly || 0;
                return (
                  <div key={l._id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={l.images?.[0]} alt={l.propertyName} />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-label-sm text-on-surface shadow-sm font-bold">${price.toLocaleString()}/mo</div>
                      <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-error shadow-sm hover:bg-white transition-colors">
                        <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>favorite</span>
                      </button>
                    </div>
                    <div className="p-[24px]">
                      <div className="flex items-center gap-2 mb-2">
                        {l.verified && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container"><span className="material-symbols-outlined text-[12px] mr-1" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>VERIFIED</span>}
                        <span className="flex items-center gap-1 text-label-sm text-slate-500">
                          <span className={`w-2 h-2 rounded-full ${l.availability === 'filling_fast' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                          {l.availability === 'filling_fast' ? 'Filling Fast' : 'Available'}
                        </span>
                      </div>
                      <Link to={`/listings/${l._id}`}><h4 className="font-h3 text-body-lg text-on-surface mb-1">{l.propertyName}</h4></Link>
                      <p className="text-label-sm text-on-surface-variant mb-4">{l.distanceFromCampus || l.city}</p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-4 text-slate-500">
                          {l.amenities?.slice(0,2).map(a => (
                            <div key={a} className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">{a === 'High-speed WiFi' ? 'wifi' : a === 'Air Conditioning' ? 'ac_unit' : 'check_circle'}</span>
                              <span className="text-xs">{a.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                        <Link to={`/listings/${l._id}`} className="text-primary font-label-md flex items-center gap-1 hover:gap-2 transition-all">
                          Details <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-2 bg-white rounded-xl border border-outline-variant p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">favorite_border</span>
                  <p className="text-on-surface-variant">No favorites yet. <Link to="/listings" className="text-primary font-semibold">Browse listings</Link></p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Contacts Sidebar */}
          <aside className="space-y-[24px]">
            <div className="flex items-center justify-between">
              <h3 className="font-h3 text-h3 text-on-surface">Recent Contacts</h3>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">more_horiz</span>
            </div>
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm divide-y divide-slate-100">
              {messages.length > 0 ? messages.map((m, i) => (
                <div key={m._id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${contactBgs[i % 3]}`}>
                    <span className="material-symbols-outlined">{contactIcons[i % 3]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-label-md text-on-surface">{m.receiver?.name || m.sender?.name}</h5>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {new Date(m.createdAt).toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant truncate w-40">{m.content?.substring(0, 30)}...</p>
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[m.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]}`}></span>
                      {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-on-surface-variant text-sm">No messages yet</div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="bg-indigo-600 p-4 rounded-xl text-white">
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Bookings</p>
                <p className="text-h3">02</p>
              </div>
              <div className="bg-white border border-outline-variant p-4 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Favorites</p>
                <p className="text-h3 text-on-surface">{favorites.length || 0}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Action Center CTA */}
        <section className="mt-[24px]">
          <div className="bg-surface-container text-on-surface rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-h2 text-h2 mb-2">Finding a place has never been easier.</h4>
              <p className="text-body-md opacity-80 max-w-lg mb-6">Complete your profile to get personalized housing recommendations and faster booking approvals from owners.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/listings" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
                  Browse Listings <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link to="/help" className="bg-white/50 backdrop-blur-sm border border-outline-variant px-6 py-3 rounded-lg font-label-md hover:bg-white transition-all">
                  How it works
                </Link>
              </div>
            </div>
            <div className="hidden md:block absolute -right-20 -bottom-20 opacity-10">
              <span className="material-symbols-outlined" style={{fontSize: '320px'}}>home</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
