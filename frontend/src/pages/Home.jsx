import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/listings?limit=6').then(r => setFeatured(r.data.listings || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const badgeColors = { 'available': 'bg-teal-500', 'filling_fast': 'bg-amber-500', 'filled': 'bg-red-500' };
  const badgeIcons = { 'available': 'check_circle', 'filling_fast': 'bolt', 'filled': 'block' };
  const badgeText = { 'available': 'Verified', 'filling_fast': 'Filling Fast', 'filled': 'Filled' };

  return (
    <div className="font-body-md antialiased">
      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-surface-container to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="font-h1 text-h1 text-on-background mb-6">
            Find your perfect home <br /><span className="text-primary">near your university</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Verified PGs and student housing options designed for comfort, community, and academic success.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-2 flex flex-col md:flex-row items-center gap-2 border border-slate-100">
            <div className="flex items-center flex-1 px-4 w-full">
              <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
              <input className="w-full border-none focus:ring-0 py-4 text-body-md text-on-surface" placeholder="Search by city, area, or college name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center px-4 w-full md:w-auto">
              <span className="material-symbols-outlined text-slate-400 mr-3">location_on</span>
              <select className="border-none focus:ring-0 py-4 text-body-md text-on-surface bg-transparent">
                <option>Near Me</option><option>London</option><option>Boston</option><option>Seattle</option>
              </select>
            </div>
            <Link to={search ? `/listings?search=${encodeURIComponent(search)}` : '/listings'} className="w-full md:w-auto bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-95 text-center">
              Search
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-12">
            {[
              { icon: 'verified', label: 'Verified Properties' },
              { icon: 'security', label: '100% Secure' },
              { icon: 'money_off', label: 'Zero Brokerage' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="bg-secondary-container p-2 rounded-full">
                  <span className="material-symbols-outlined text-secondary">{b.icon}</span>
                </div>
                <span className="font-label-md text-on-surface">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-h2 text-h2 text-on-background mb-2">Featured Listings</h2>
              <p className="text-on-surface-variant">Handpicked stays for the modern student.</p>
            </div>
            <Link to="/listings" className="text-primary font-label-md flex items-center gap-1 hover:underline underline-offset-4">
              View All Listings <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200 animate-pulse"><div className="aspect-video bg-surface-container-high" /><div className="p-6 space-y-3"><div className="h-5 bg-surface-container-high rounded w-3/4" /><div className="h-4 bg-surface-container-high rounded w-1/2" /></div></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.slice(0, 6).map(l => {
                const price = l.roomConfigs?.[0]?.priceMonthly || 0;
                return (
                  <Link to={`/listings/${l._id}`} key={l._id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                    <div className="relative aspect-video">
                      <img alt={l.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={l.images?.[0]} />
                      <div className={`absolute top-4 left-4 ${l.verified ? 'bg-teal-500' : badgeColors[l.availability] || 'bg-teal-500'} text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>{l.verified ? 'check_circle' : badgeIcons[l.availability]}</span>
                        {l.verified ? 'Verified' : badgeText[l.availability]}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <span className="text-primary font-bold text-lg">${price.toLocaleString()}</span><span className="text-slate-500 text-sm">/mo</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-h3 text-xl mb-1">{l.propertyName}</h3>
                      <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                        <span className="material-symbols-outlined text-sm">location_on</span> {l.city || l.address}
                      </p>
                      <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                        {l.amenities?.slice(0, 3).map(a => (
                          <div key={a} className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">{a === 'High-speed WiFi' ? 'wifi' : a === 'Air Conditioning' ? 'ac_unit' : a === 'Gourmet Meals' ? 'restaurant' : a === 'Smart Security' ? 'shield' : a === 'Parking Space' ? 'local_parking' : a === 'Gym' ? 'fitness_center' : 'check_circle'}</span>
                            {a.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-indigo-900 rounded-[2rem] overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-12 lg:p-20">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-h2 text-h2 text-white mb-6">Are you a property owner?</h2>
              <p className="text-indigo-100 text-body-lg mb-8">Join the largest network of student accommodation and fill your rooms faster with high-quality tenants.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/add-listing" className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-label-md hover:bg-slate-100 transition-colors text-center">List Your Property</Link>
                <Link to="/help" className="border border-white/30 text-white px-8 py-4 rounded-xl font-label-md hover:bg-white/10 transition-colors text-center">Learn More</Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 grid grid-cols-2 gap-4">
                {[{v:'50k+',l:'Active Students'},{v:'10k+',l:'Property Owners'},{v:'4.8',l:'Avg Rating'},{v:'24h',l:'Response Time'}].map(s => (
                  <div key={s.l} className="p-6 bg-white rounded-xl">
                    <h4 className="text-primary font-bold text-3xl mb-1">{s.v}</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
