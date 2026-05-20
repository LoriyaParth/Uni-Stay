const mongoose = require('mongoose');
const Listing = require('./models/Listing');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/unistay');
  
  const listingData = {
    propertyName: '',
    propertyType: 'Paying Guest (PG)',
    address: '',
    city: '',
    description: '',
    amenities: ['Daily Cleaning', 'High-speed WiFi'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    roomConfigs: [
      {
        occupancy: 'Single Sharing',
        priceMonthly: 0,
        deposit: 0,
        availableUnits: 1
      }
    ],
    status: 'published',
    owner: new mongoose.Types.ObjectId()
  };

  try {
    const listing = new Listing(listingData);
    await listing.validate();
    console.log('Validation passed!');
  } catch (error) {
    console.error('Validation error:', error.message);
  }
  
  mongoose.disconnect();
}

run();
