const mongoose = require('mongoose');

const roomConfigSchema = new mongoose.Schema({
  occupancy: {
    type: String,
    required: true
  },
  priceMonthly: { type: Number, required: true, min: 0 },
  deposit: { type: Number, required: true, min: 0 },
  availableUnits: { type: Number, required: true, min: 0 }
}, { _id: true });

const listingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyName: { type: String, required: [true, 'Property name is required'], trim: true, maxlength: 100 },
  propertyType: {
    type: String,
    enum: ['Paying Guest (PG)', 'Private Apartment', 'Shared Flat', 'Hostel'],
    required: [true, 'Property type is required']
  },
  address: { type: String, required: [true, 'Address is required'], trim: true },
  city: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  description: { type: String, trim: true, maxlength: 2000 },
  images: [{ type: String }],
  roomConfigs: [roomConfigSchema],
  amenities: [{ type: String }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  // New fields for dashboard designs
  gender: { type: String, enum: ['Male', 'Female', 'Co-ed'], default: 'Co-ed' },
  availability: { type: String, enum: ['available', 'filling_fast', 'filled'], default: 'available' },
  distanceFromCampus: { type: String, default: '' },
  deposit: { type: Number, default: 0 },
  policies: [{
    icon: String,
    title: String,
    description: String
  }],
  verified: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

listingSchema.index({ propertyName: 'text', address: 'text', city: 'text' });
listingSchema.index({ status: 1, propertyType: 1 });

module.exports = mongoose.model('Listing', listingSchema);
