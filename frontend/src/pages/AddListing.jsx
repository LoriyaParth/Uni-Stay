import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

const AMENITIES = [
  { key: 'RO Water Purifier', icon: 'water_drop' },
  { key: 'Daily Cleaning', icon: 'cleaning_services' },
  { key: 'Parking Space', icon: 'local_parking' },
  { key: 'High-speed WiFi', icon: 'wifi' },
  { key: 'Air Conditioning', icon: 'ac_unit' },
  { key: 'Mess/Kitchen', icon: 'restaurant' },
];

export default function AddListing() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    propertyName: '', propertyType: 'Paying Guest (PG)', address: '', 
    city: '', description: '', amenities: ['Daily Cleaning', 'High-speed WiFi'],
  });
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [imgs, setImgs] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [rooms, setRooms] = useState([
    { occupancy: '1 Person', priceMonthly: '', deposit: '', availableUnits: '' }
  ]);
  const [policies, setPolicies] = useState([
    { icon: 'info', title: 'General Rule', description: '' }
  ]);

  const onFiles = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);
    if (imgs.length + files.length > 10) { toast.error('Max 10 images'); return; }
    setImgs(p => [...p, ...files]);
    files.forEach(f => { const r = new FileReader(); r.onload = ev => setPreviews(p => [...p, ev.target.result]); r.readAsDataURL(f); });
  };
  const rmImg = i => { setImgs(p => p.filter((_, j) => j !== i)); setPreviews(p => p.filter((_, j) => j !== i)); };
  const addRoom = () => setRooms([...rooms, { occupancy: '1 Person', priceMonthly: '', deposit: '', availableUnits: '' }]);
  const rmRoom = i => { if (rooms.length > 1) setRooms(rooms.filter((_, j) => j !== i)); };
  const updRoom = (i, k, v) => { const u = [...rooms]; u[i] = { ...u[i], [k]: v }; setRooms(u); };
  const addPolicy = () => setPolicies([...policies, { icon: 'info', title: '', description: '' }]);
  const rmPolicy = i => setPolicies(policies.filter((_, j) => j !== i));
  const updPolicy = (i, k, v) => { const u = [...policies]; u[i] = { ...u[i], [k]: v }; setPolicies(u); };
  const togAmenity = a => setForm(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }));

  const submit = async (e, status = 'published') => {
    e.preventDefault(); setBusy(true);
    try {
      let urls = [];
      if (imgs.length) {
        const fd = new FormData(); imgs.forEach(i => fd.append('images', i));
        try { const r = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', ''); urls = r.data.urls.map(u => `${baseUrl}${u}`); } catch { urls = []; }
      }
      await api.post('/listings', {
        ...form, 
        location,
        images: urls.length ? urls : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        roomConfigs: rooms.map(r => ({ ...r, priceMonthly: +r.priceMonthly || 0, deposit: +r.deposit || 0, availableUnits: +r.availableUnits || 1 })),
        policies,
        status,
      });
      toast.success(status === 'draft' ? 'Saved as draft!' : 'Listing published!');
      navigate('/listings');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setBusy(false); }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <header className="mb-12">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Create New Listing</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Complete the form below to list your property on UniStay.</p>
      </header>
      <form onSubmit={e => submit(e)} className="space-y-12">
        {/* Basic Info */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">info</span></div>
            <h2 className="font-h3 text-h3">Basic Info</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Property Name</label>
              <input className="w-full p-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Royal Heights Boys PG" type="text" value={form.propertyName} onChange={e => setForm({...form, propertyName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Property Type</label>
              <select className="w-full p-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                <option>Paying Guest (PG)</option><option>Private Apartment</option><option>Shared Flat</option><option>Hostel</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Full Address</label>
              <textarea className="w-full p-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Street name, landmark, city, and zip code" rows="3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Pin Location on Map</label>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-outline-variant relative z-10">
                <MapContainer center={[location.lat, location.lng]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  <LocationMarker position={location} setPosition={setLocation} />
                </MapContainer>
              </div>
              <p className="text-xs text-slate-500">Click on the map to set the exact location.</p>
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">City</label>
              <input className="w-full p-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Bangalore" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Description</label>
              <input className="w-full p-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">photo_library</span></div>
            <h2 className="font-h3 text-h3">Media</h2>
          </div>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); onFiles(e); }}>
            <span className="material-symbols-outlined text-4xl text-outline mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
            <h3 className="font-label-md text-body-md mb-2">Drag and drop your photos here</h3>
            <p className="text-on-surface-variant text-label-sm">High-quality JPG or PNG, minimum 1200x800px (Max 10 images)</p>
            <button className="mt-6 px-6 py-2 bg-white border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-white transition-all" type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>Browse Files</button>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" multiple onChange={onFiles} />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-8">
            {previews.map((p, i) => (
              <div key={i} className="aspect-square rounded-lg bg-surface-container-high relative group overflow-hidden border border-outline-variant">
                <img className="w-full h-full object-cover" src={p} alt="" />
                <button type="button" onClick={() => rmImg(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined text-xs">close</span></button>
              </div>
            ))}
            {previews.length < 10 && <div className="aspect-square rounded-lg bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:border-primary transition-all" onClick={() => fileRef.current?.click()}><span className="material-symbols-outlined text-outline">add</span></div>}
          </div>
        </section>

        {/* Room Configs */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">bed</span></div>
              <h2 className="font-h3 text-h3">Room Configurations</h2>
            </div>
            <button className="flex items-center gap-2 text-primary font-label-md hover:underline decoration-2 underline-offset-4" type="button" onClick={addRoom}><span className="material-symbols-outlined">add_circle</span>Add Room Type</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-outline-variant">
                <th className="pb-4 font-label-md text-on-surface-variant">Occupancy</th>
                <th className="pb-4 font-label-md text-on-surface-variant">Price (Monthly)</th>
                <th className="pb-4 font-label-md text-on-surface-variant">Deposit</th>
                <th className="pb-4 font-label-md text-on-surface-variant">Available Units</th>
                <th className="pb-4"></th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant">
                {rooms.map((r, i) => (
                  <tr key={i}>
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-slate-800 w-6">{i + 1}.</span>
                        <div className="flex items-center border border-outline-variant rounded-lg w-fit overflow-hidden bg-surface">
                          <button type="button" onClick={() => {
                            let num = parseInt(r.occupancy) || 1;
                            num = Math.max(1, num - 1);
                            updRoom(i, 'occupancy', `${num} Person${num > 1 ? 's' : ''}`);
                          }} className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors font-bold border-r border-outline-variant">-</button>
                          
                          <div className="w-24 text-center py-2 bg-transparent text-sm font-semibold text-slate-700">
                            {r.occupancy || '1 Person'}
                          </div>
                          
                          <button type="button" onClick={() => {
                            let num = parseInt(r.occupancy) || 1;
                            num += 1;
                            updRoom(i, 'occupancy', `${num} Person${num > 1 ? 's' : ''}`);
                          }} className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors font-bold border-l border-outline-variant">+</button>
                        </div>
                      </div>
                    </td>
                    <td className="py-6"><div className="flex items-center gap-2"><span className="text-on-surface-variant font-label-md">₹</span><input className="w-24 p-2 bg-surface border border-outline-variant rounded-lg" placeholder="0" type="number" value={r.priceMonthly} onChange={e => updRoom(i,'priceMonthly',e.target.value)} /></div></td>
                    <td className="py-6"><div className="flex items-center gap-2"><span className="text-on-surface-variant font-label-md">₹</span><input className="w-24 p-2 bg-surface border border-outline-variant rounded-lg" placeholder="0" type="number" value={r.deposit} onChange={e => updRoom(i,'deposit',e.target.value)} /></div></td>
                    <td className="py-6">
                      <div className="flex items-center border border-outline-variant rounded-lg w-fit overflow-hidden bg-surface">
                        <button type="button" onClick={() => updRoom(i, 'availableUnits', Math.max(0, parseInt(r.availableUnits || 0) - 1))} className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors font-bold border-r border-outline-variant">-</button>
                        <input className="w-12 text-center py-2 bg-transparent border-none focus:ring-0 font-semibold" value={r.availableUnits || 0} onChange={e => updRoom(i,'availableUnits',parseInt(e.target.value) || 0)} />
                        <button type="button" onClick={() => updRoom(i, 'availableUnits', parseInt(r.availableUnits || 0) + 1)} className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors font-bold border-l border-outline-variant">+</button>
                      </div>
                    </td>
                    <td className="py-6 text-right"><button className="text-error hover:bg-error-container p-2 rounded-full transition-colors" type="button" onClick={() => rmRoom(i)}><span className="material-symbols-outlined">delete</span></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">checklist</span></div>
            <h2 className="font-h3 text-h3">Amenities Checklist</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AMENITIES.map(a => (
              <label key={a.key} className={`flex items-center justify-between p-4 bg-surface border rounded-xl cursor-pointer hover:border-primary transition-all ${form.amenities.includes(a.key) ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-on-surface-variant">{a.icon}</span><span className="font-label-md">{a.key}</span></div>
                <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" checked={form.amenities.includes(a.key)} onChange={() => togAmenity(a.key)} />
              </label>
            ))}
          </div>
        </section>

        {/* Rules & Regulations */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">rule</span></div>
              <h2 className="font-h3 text-h3">Rules & Regulations</h2>
            </div>
            <button className="flex items-center gap-2 text-primary font-label-md hover:underline decoration-2 underline-offset-4" type="button" onClick={addPolicy}><span className="material-symbols-outlined">add_circle</span>Add Rule</button>
          </div>
          <div className="space-y-4">
            {policies.map((p, i) => (
              <div key={i} className="flex gap-4 items-start bg-surface p-4 border border-outline-variant rounded-xl">
                <input className="w-16 p-2 bg-surface-container-low border border-outline-variant rounded-lg text-center" placeholder="Icon" value={p.icon} onChange={e => updPolicy(i, 'icon', e.target.value)} title="Material icon name (e.g. info, warning, block)" />
                <div className="flex-1 space-y-2">
                  <input className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg font-bold" placeholder="Rule Title (e.g. Quiet Hours)" value={p.title} onChange={e => updPolicy(i, 'title', e.target.value)} />
                  <textarea className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm" placeholder="Detailed description of the rule..." rows="2" value={p.description} onChange={e => updPolicy(i, 'description', e.target.value)}></textarea>
                </div>
                <button className="text-error hover:bg-error-container p-2 rounded-full transition-colors mt-2" type="button" onClick={() => rmPolicy(i)}><span className="material-symbols-outlined">delete</span></button>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <footer className="flex items-center justify-between pt-8">
          <button className="px-8 py-3 text-on-surface-variant font-label-md hover:text-on-surface transition-colors" type="button" onClick={e => submit(e, 'draft')} disabled={busy}>Save as Draft</button>
          <div className="flex items-center gap-4">
            <button className="px-8 py-3 bg-white border border-outline-variant text-on-surface font-label-md rounded-lg hover:bg-surface-container-low transition-all" type="button" onClick={() => navigate(-1)}>Cancel</button>
            <button className="px-10 py-3 bg-primary text-white font-label-md rounded-lg hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2" type="submit" disabled={busy}>
              {busy ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Publish Listing'}
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
}
