import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/favorites').then(r => setFavorites(r.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const removeFav = async (id) => {
    try { await api.post(`/favorites/${id}`); setFavorites(f => f.filter(l => l._id !== id)); toast.success('Removed from favorites'); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-background mb-2">My Favorites</h1>
        <p className="text-on-surface-variant">Properties you've saved for later review</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(l => {
            const price = l.roomConfigs?.[0]?.priceMonthly || 0;
            return (
              <div key={l._id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                <div className="relative aspect-[16/10]">
                  <img alt={l.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={l.images?.[0]} />
                  <button onClick={() => removeFav(l._id)} className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>favorite</span>
                  </button>
                  <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    ${price.toLocaleString()}<span className="text-xs font-normal opacity-80">/mo</span>
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/listings/${l._id}`} className="font-h3 text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 block">{l.propertyName}</Link>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {l.city || l.address}
                  </p>
                  <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                    {l.amenities?.slice(0, 3).map(a => (
                      <div key={a} className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">{a === 'High-speed WiFi' ? 'wifi' : a === 'Air Conditioning' ? 'ac_unit' : 'check_circle'}</span>
                        <span className="text-xs">{a.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">favorite_border</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
          <p className="text-slate-500 mb-6">Start browsing and save properties you like</p>
          <Link to="/listings" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">Browse Listings</Link>
        </div>
      )}
    </div>
  );
}
