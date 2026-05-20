import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '', type: searchParams.get('type') || '',
    city: '', minPrice: '', maxPrice: '', occupancy: '',
  });
  const [amenityToggles, setAmenityToggles] = useState({ ac: false, wifi: false, meals: false, laundry: false });

  useEffect(() => { fetchListings(); }, [page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filters.search) p.set('search', filters.search);
      if (filters.type) p.set('type', filters.type);
      if (filters.city) p.set('city', filters.city);
      if (filters.minPrice) p.set('minPrice', filters.minPrice);
      if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
      p.set('page', page);
      const r = await api.get(`/listings?${p.toString()}`);
      setListings(r.data.listings || []);
      setTotal(r.data.total || 0);
      setPages(r.data.pages || 1);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const applyFilters = () => { setPage(1); fetchListings(); };

  const availColors = { available: 'text-green-600', filling_fast: 'text-amber-600', filled: 'text-red-600' };
  const availDot = { available: 'bg-green-500', filling_fast: 'bg-amber-500', filled: 'bg-red-500' };
  const availText = { available: 'Available', filling_fast: 'Filling Fast', filled: 'Filled' };
  const badgeColors = { available: 'bg-teal-500', filling_fast: 'bg-amber-500', filled: 'bg-red-500' };
  const amenityIcon = a => ({ 'High-speed WiFi': 'wifi', 'Air Conditioning': 'ac_unit', 'Gourmet Meals': 'restaurant', 'Daily Cleaning': 'cleaning_services', 'Laundry Service': 'local_laundry_service', 'Professional Laundry': 'local_laundry_service', 'Smart Security': 'security', 'Kitchen': 'kitchen', 'Parking Space': 'local_parking', 'Power Backup': 'electric_bolt', 'Gym': 'fitness_center' }[a] || 'check_circle');

  return (
    <div className="flex flex-1 overflow-hidden min-h-screen">
      {/* Sidebar Filters */}
      <aside className="hidden lg:flex flex-col w-80 h-[calc(100vh-73px)] border-r border-slate-200 bg-white fixed top-[73px] left-0 py-8 px-6 overflow-y-auto custom-scrollbar z-10">
        <div className="space-y-8">
          <div>
            <h4 className="font-h3 text-base text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">filter_list</span> Filters
            </h4>
            <div className="space-y-6">
              {/* Property Type */}
              <section>
                <span className="block font-label-md text-slate-500 uppercase tracking-widest text-[11px] mb-3">Property Type</span>
                <div className="space-y-2">
                  {['Hostel', 'Paying Guest (PG)', 'Private Apartment', 'Shared Flat'].map(t => (
                    <label key={t} className="flex items-center gap-3 group cursor-pointer">
                      <input type="checkbox" checked={filters.type === t} onChange={() => setFilters({...filters, type: filters.type === t ? '' : t})} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                      <span className={`text-body-md text-slate-700 group-hover:text-indigo-600 transition-colors ${filters.type === t ? 'font-medium' : ''}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </section>
              {/* Budget */}
              <section>
                <div className="flex justify-between items-center mb-3">
                  <span className="block font-label-md text-slate-500 uppercase tracking-widest text-[11px]">Budget (Monthly)</span>
                  <span className="text-xs font-semibold text-indigo-600">${filters.minPrice || '0'} - ${filters.maxPrice || '5000'}</span>
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm" />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </section>
              {/* Occupancy */}
              <section>
                <span className="block font-label-md text-slate-500 uppercase tracking-widest text-[11px] mb-3">Occupancy</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Single', '2-Sharing', '3-Sharing', '4-Sharing'].map(o => (
                    <button key={o} onClick={() => setFilters({...filters, occupancy: filters.occupancy === o ? '' : o})} className={`py-2 px-3 border rounded-lg text-sm transition-all font-medium ${filters.occupancy === o ? 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </section>
              {/* Amenity Toggles */}
              <section>
                <span className="block font-label-md text-slate-500 uppercase tracking-widest text-[11px] mb-3">Amenity Toggles</span>
                <div className="space-y-3">
                  {[{k:'ac',l:'Air Conditioning'},{k:'wifi',l:'High-speed WiFi'},{k:'meals',l:'Daily Meals'},{k:'laundry',l:'Laundry Service'}].map(a => (
                    <label key={a.k} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-slate-700">{a.l}</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={amenityToggles[a.k]} onChange={() => setAmenityToggles({...amenityToggles, [a.k]: !amenityToggles[a.k]})} />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100">
            <button onClick={applyFilters} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">Apply Changes</button>
            <button onClick={() => { setFilters({ search: '', type: '', city: '', minPrice: '', maxPrice: '', occupancy: '' }); setAmenityToggles({ ac: false, wifi: false, meals: false, laundry: false }); }} className="w-full mt-2 text-slate-500 py-2 text-sm font-medium hover:text-indigo-600 hover:underline transition-all">Clear All Filters</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto lg:ml-80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-h2 text-slate-900">Found {total} Accommodations</h1>
              <p className="text-slate-500 mt-1">Browse verified student housing options</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm font-semibold transition-all">
                <span className="material-symbols-outlined text-[20px]">grid_view</span> Grid View
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-all">
                <span className="material-symbols-outlined text-[20px]">map</span> Map View
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2">
              <input className="flex-1 p-3 border border-slate-200 rounded-lg text-sm" placeholder="Search..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
              <button onClick={applyFilters} className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold"><span className="material-symbols-outlined">search</span></button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse"><div className="aspect-[16/10] bg-surface-container-high" /><div className="p-6 space-y-3"><div className="h-5 bg-surface-container-high rounded w-3/4" /><div className="h-4 bg-surface-container-high rounded w-1/2" /></div></div>)}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map(l => {
                const price = l.roomConfigs?.[0]?.priceMonthly || 0;
                const occ = l.roomConfigs?.[0]?.occupancy || 'Single';
                return (
                  <div key={l._id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img alt={l.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={l.images?.[0]} />
                      <div className="absolute top-4 left-4">
                        <span className={`${l.verified ? 'bg-teal-500' : badgeColors[l.availability]} text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings:"'FILL' 1"}}>{l.verified ? 'verified' : 'bolt'}</span>
                          {l.verified ? 'Verified' : availText[l.availability]}
                        </span>
                      </div>
                      <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                          ${price.toLocaleString()}<span className="text-xs font-normal opacity-80">/mo</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-1 flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`flex items-center gap-1 ${availColors[l.availability]} text-xs font-bold`}>
                          <span className={`w-2 h-2 rounded-full ${availDot[l.availability]}`}></span> {availText[l.availability]}
                        </span>
                        {l.distanceFromCampus && <><span className="text-slate-300">•</span><span className="text-slate-500 text-xs font-medium">{l.distanceFromCampus}</span></>}
                      </div>
                      <Link to={`/listings/${l._id}`} className="font-h3 text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{l.propertyName}</Link>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{l.description}</p>
                      <div className="flex items-center justify-between py-4 border-y border-slate-100 mb-4">
                        {l.amenities?.slice(0, 3).map(a => (
                          <div key={a} className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-symbols-outlined text-[18px]">{amenityIcon(a)}</span>
                            <span className="text-xs font-medium">{a.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Security Deposit</span>
                          <span className="text-sm font-semibold text-slate-700">${(l.deposit || l.roomConfigs?.[0]?.deposit || 0).toLocaleString()}</span>
                        </div>
                        <Link to={`/listings/${l._id}`} className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors text-sm">View Details</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <h3 className="text-lg font-semibold text-on-surface mb-2">No listings found</h3>
              <p className="text-on-surface-variant">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page-1))} disabled={page===1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {Array.from({length: Math.min(pages, 5)}, (_, i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${page === p ? 'bg-indigo-600 text-white font-bold' : 'border border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(Math.min(pages, page+1))} disabled={page===pages} className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <Link to="/add-listing" className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>
    </div>
  );
}
