import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ListingCard({ listing, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const mainImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';
  const lowestPrice = listing.roomConfigs?.length
    ? Math.min(...listing.roomConfigs.map(r => r.priceMonthly))
    : 0;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      const res = await api.post(`/favorites/${listing._id}`);
      setFavorited(res.data.favorited);
      toast.success(res.data.message);
      onFavoriteToggle?.();
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const propertyTypeColors = {
    'Paying Guest (PG)': 'bg-indigo-100 text-indigo-700',
    'Private Apartment': 'bg-emerald-100 text-emerald-700',
    'Shared Flat': 'bg-amber-100 text-amber-700',
    'Hostel': 'bg-rose-100 text-rose-700',
  };

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
        <img
          src={mainImage}
          alt={listing.propertyName}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && (
          <div className="absolute inset-0 bg-surface-container-high animate-pulse" />
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
        >
          <span className={`material-symbols-outlined text-lg ${favorited ? 'text-red-500' : 'text-slate-400'}`}
                style={favorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
            favorite
          </span>
        </button>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${propertyTypeColors[listing.propertyType] || 'bg-slate-100 text-slate-700'}`}>
          {listing.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-on-surface text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {listing.propertyName}
        </h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-3">
          <span className="material-symbols-outlined text-base">location_on</span>
          <span className="line-clamp-1">{listing.city || listing.address}</span>
        </div>

        {/* Amenities preview */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.amenities?.slice(0, 3).map(amenity => (
            <span key={amenity} className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant text-xs rounded-full">
              {amenity}
            </span>
          ))}
          {listing.amenities?.length > 3 && (
            <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant text-xs rounded-full">
              +{listing.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between pt-3 border-t border-outline-variant/50">
          <div>
            <span className="text-primary font-bold text-lg">₹{lowestPrice.toLocaleString()}</span>
            <span className="text-on-surface-variant text-xs ml-1">/month</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">bed</span>
            {listing.roomConfigs?.length || 0} types
          </div>
        </div>
      </div>
    </Link>
  );
}
