import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function ListingDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [l, setL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!isAuthenticated) { toast.error('Please login to send a message'); return; }
    setSending(true);
    try {
      await api.post('/messages', {
        receiver: l.owner._id,
        listing: l._id,
        content: messageText
      });
      toast.success('Message sent successfully!');
      setShowMessageModal(false);
      setMessageText('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/listings/${id}`);
        setL(r.data);
        if (isAuthenticated) try { const f = await api.get(`/favorites/check/${id}`); setFav(f.data.favorited); } catch {}
      } catch { toast.error('Listing not found'); } finally { setLoading(false); }
    })();
  }, [id]);

  const toggleFav = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try { const r = await api.post(`/favorites/${id}`); setFav(r.data.favorited); toast.success(r.data.message); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!l) return <div className="min-h-screen flex items-center justify-center"><p>Listing not found</p></div>;

  const price = l.roomConfigs?.[0]?.priceMonthly || 0;
  const deposit = l.deposit || l.roomConfigs?.[0]?.deposit || 0;
  const amenityMap = { 'High-speed WiFi': { icon: 'wifi', sub: 'Unlimited 500Mbps' }, 'Air Conditioning': { icon: 'ac_unit', sub: 'In-room Control' }, 'Professional Laundry': { icon: 'local_laundry_service', sub: 'Bi-weekly Service' }, 'Laundry Service': { icon: 'local_laundry_service', sub: 'Bi-weekly Service' }, 'Gourmet Meals': { icon: 'restaurant', sub: '3 Meals + Snacks' }, 'Power Backup': { icon: 'electric_bolt', sub: '24/7 UPS & Generator' }, 'Smart Security': { icon: 'security', sub: 'CCTV & Keycard' }, 'Daily Cleaning': { icon: 'cleaning_services', sub: 'Daily Service' }, 'Parking Space': { icon: 'local_parking', sub: 'Reserved Spot' }, 'Kitchen': { icon: 'kitchen', sub: 'Fully Equipped' }, 'Gym': { icon: 'fitness_center', sub: 'Modern Equipment' } };

  return (
    <main className="max-w-[1280px] mx-auto px-6 md:px-16 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-slate-500 font-label-sm">
        <Link to="/listings" className="hover:text-primary transition-colors">Search Results</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-background font-semibold">{l.propertyName}</span>
      </nav>

      {/* Bento Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-10">
        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl shadow-sm group">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={l.images?.[0]} alt={l.propertyName} />
          {l.verified && (
            <span className="absolute top-4 left-4 bg-secondary text-white font-label-sm px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>verified</span> Verified
            </span>
          )}
        </div>
        {l.images?.slice(1, 5).map((img, i) => (
          <div key={i} className={`hidden md:block relative overflow-hidden rounded-xl shadow-sm group ${i === 3 ? '' : ''}`}>
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={img} alt="" />
            {i === 3 && l.images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                <span className="text-white font-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined">grid_view</span> View All Photos
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Overview */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="font-h1 text-h1 text-on-background mb-2">{l.propertyName}</h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  <span className="font-body-md">{l.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors text-on-surface-variant font-label-md">
                  <span className="material-symbols-outlined text-[20px]">share</span> Share
                </button>
                <button onClick={toggleFav} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors text-on-surface-variant font-label-md">
                  <span className="material-symbols-outlined text-[20px]" style={fav ? {fontVariationSettings:"'FILL' 1"} : {}}>{fav ? 'favorite' : 'favorite_border'}</span> {fav ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
            {/* Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-container-low rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col">
                <span className="text-slate-500 font-label-sm uppercase tracking-wider mb-1">Monthly Rent</span>
                <span className="text-primary font-h3 text-h3">${price.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-slate-500 font-label-sm uppercase tracking-wider mb-1">Security Deposit</span>
                <span className="text-on-background font-h3 text-h3">${deposit.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-slate-500 font-label-sm uppercase tracking-wider mb-1">Availability</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${l.availability === 'filling_fast' ? 'bg-amber-500' : l.availability === 'filled' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span className="text-on-background font-label-md">{l.availability === 'filling_fast' ? 'Filling Fast' : l.availability === 'filled' ? 'Filled' : 'Available'}</span>
                </div>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-slate-500 font-label-sm uppercase tracking-wider mb-1">Gender</span>
                <span className="text-on-background font-label-md mt-2">{l.gender === 'Co-ed' ? 'Co-ed (All Welcome)' : l.gender}</span>
              </div>
            </div>
          </section>

          {l.description && <p className="text-on-surface-variant mb-10">{l.description}</p>}
          <hr className="border-slate-200 mb-10" />

          {/* Amenities */}
          <section className="mb-10">
            <h2 className="font-h2 text-h2 mb-6">World-Class Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {l.amenities?.map(a => {
                const info = amenityMap[a] || { icon: 'check_circle', sub: 'Included' };
                return (
                  <div key={a} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{info.icon}</span>
                    </div>
                    <div>
                      <p className="font-label-md">{a}</p>
                      <p className="text-xs text-slate-500">{info.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <hr className="border-slate-200 mb-10" />

          {/* Policies */}
          {l.policies?.length > 0 && (
            <section className="mb-10">
              <h2 className="font-h2 text-h2 mb-6">Hostel Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {l.policies.map((p, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-tertiary mt-1">{p.icon}</span>
                      <div>
                        <h4 className="font-label-md text-on-background">{p.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-container p-6 rounded-xl border border-slate-200">
                  <h4 className="font-label-md text-on-background flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-error">info</span> Essential Note
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Smoking and consumption of alcohol are strictly prohibited on the premises. We maintain a zero-tolerance policy for noise disturbances after 10:00 PM.
                  </p>
                </div>
              </div>
            </section>
          )}
          <hr className="border-slate-200 mb-10" />

          {/* Location */}
          <section>
            <h2 className="font-h2 text-h2 mb-6">Location</h2>
            <div className="w-full h-80 bg-slate-200 rounded-2xl relative overflow-hidden z-10 border border-slate-200">
              {l.location && l.location.lat ? (
                <MapContainer center={[l.location.lat, l.location.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  <Marker position={[l.location.lat, l.location.lng]}></Marker>
                </MapContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col items-center gap-2 border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                    <p className="font-label-md text-on-background">{l.propertyName}</p>
                    <p className="text-xs text-slate-500">Location not pinned on map</p>
                  </div>
                </div>
              )}
            </div>
            {l.location && l.location.lat && (
              <div className="mt-4 flex justify-end">
                <a href={`https://www.google.com/maps/search/?api=1&query=${l.location.lat},${l.location.lng}`} target="_blank" rel="noopener noreferrer" className="text-primary font-label-md uppercase tracking-wide hover:underline flex items-center gap-1">
                  Open in Google Maps <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sticky CTA Sidebar */}
        <aside className="relative">
          <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-500 font-label-sm uppercase tracking-widest mb-1">Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-h1 font-h1 text-primary">${price.toLocaleString()}</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                </div>
                <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">-10% EARLY BIRD</div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Room Type</label>
                  <select className="w-full bg-transparent border-none p-0 focus:ring-0 font-label-md text-on-background">
                    {l.roomConfigs?.map((r, i) => <option key={i}>{r.occupancy}</option>)}
                  </select>
                </div>
                <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Duration</label>
                  <select className="w-full bg-transparent border-none p-0 focus:ring-0 font-label-md text-on-background">
                    <option>Full Academic Year (10 months)</option>
                    <option>Single Semester (5 months)</option>
                    <option>Summer Stay (2 months)</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-xl font-label-md hover:bg-primary-container transition-all mb-4 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">event_available</span> Book a Visit
              </button>
              <button onClick={() => setShowMessageModal(true)} className="w-full bg-white border-2 border-primary text-primary py-4 rounded-xl font-label-md hover:bg-primary-fixed transition-all mb-6 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">mail</span> Contact Owner
              </button>
              <div className="flex items-center gap-4 p-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                  {l.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-label-md text-on-background">{l.owner?.name || 'Property Owner'}</p>
                  <p className="text-xs text-slate-500">Property Manager • 5★ Rating</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container px-8 py-4 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Verified by UniStay Trust</span>
              <span className="material-symbols-outlined text-secondary text-xl" style={{fontVariationSettings:"'FILL' 1"}}>verified_user</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Reviews & Comments Section */}
      <section className="mt-16 max-w-4xl">
        <h2 className="font-h2 text-h2 mb-8">Reviews & Comments</h2>
        <div className="space-y-6">
          {[
            { name: 'Sarah J.', text: 'Amazing place! The wifi is super fast and the owner is very responsive.', rating: 5, date: '2 weeks ago' },
            { name: 'Michael T.', text: 'Great location, very close to campus. The daily cleaning is a big plus.', rating: 4, date: '1 month ago' }
          ].map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{r.name.charAt(0)}</div>
                  <div>
                    <p className="font-label-md text-on-background">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.date}</p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {Array(r.rating).fill(0).map((_, j) => <span key={j} className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>star</span>)}
                </div>
              </div>
              <p className="text-on-surface-variant text-sm">{r.text}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-surface-container-low p-6 rounded-2xl border border-slate-200">
          <h4 className="font-label-md mb-4">Leave a Comment</h4>
          <textarea className="w-full p-4 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none" rows="3" placeholder="Share your experience..."></textarea>
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-all">Post Comment</button>
        </div>
      </section>

      {/* Contact Owner Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowMessageModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-h2 text-h2 mb-2">Contact Owner</h3>
            <p className="text-slate-500 text-sm mb-6">Send a message directly to {l.owner?.name || 'the owner'} regarding {l.propertyName}.</p>
            
            <textarea 
              value={messageText} 
              onChange={e => setMessageText(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-primary outline-none h-32"
              placeholder="Hi, I'm interested in your property..."
            ></textarea>
            
            <div className="flex gap-4">
              <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3 font-label-md text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all">Cancel</button>
              <button onClick={sendMessage} disabled={sending || !messageText.trim()} className="flex-1 py-3 font-label-md bg-primary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Message <span className="material-symbols-outlined text-sm">send</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
