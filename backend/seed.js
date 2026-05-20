const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Favorite = require('./models/Favorite');
const Message = require('./models/Message');

const IMG = {
  room1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJdIWHVbwQ58jMGb94VcTwW8FkzIajgHoeIz3J-7_HRfHUptkunEMGwEfy6uhq3gLAR0ylngG1N9I8G2zrYRUDGm23BDuc6jW8k6rJ5xG1IJK8eCk_DVjI7Uhsa7uTBFQS0fnpjsPiSsEvUA1zclzaufO38IG8OhmDqYbvgRKf3cvxrH-RtetzSDZma8KUVxP9xEoZ6FB-IPtMvn-iaFNC6BsLeAr0fIo31QMboqVFQdKN21yg-9BE8P9mwIoQZCJW6Hup8R-QXOU',
  social: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO3oO-v_nAuhXIpafaYCSTVLf3aJ6dJGFkyafEUsTIc25IyOoyjx60-MHa3BbvgOVyXNhDp6Qh28IUD6Nkvhr9E36g-78PX9iQu4SEZwt0tuksYzkM10GO_m4Jj7hVwMcMpi39Fpx4Wu1NHnI2zLOnVZUKueVeIj3T-2ZPWd7SHT7sQhflLZhVUAbG3jRsCuWhE7MnAfOIY9nNe0qrmtXXkEY2XnO7N1YlNkephvCnc0mIO5YQ5edzXaAIGP4SoKUyv9Q45mo51hw',
  studio: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpppyeJHbJgNv16Q7U6sRErKuPomPQ4tTbxdR_kCEyItHNsupw-WoGe5_BaSfGKqbhz16R6g2BwLpxqD0pvnsSBIyZ9dYHI5j3dvZBeOY0fAi5-ntVMQ_fOE3xFD5k6IQY3BSbhEJE8Y-zyonWuQiNTQQCPAvuT_u3Xwsg2mqOjwJEzlBAc7c7MojxJxIkqcAefyzl2GdpvUK7v9Xa4BE4WdkYQkkMVf3iJS2Thn-v6s3Fk_CUws6-fGvPbv10oOuFjmOqDOs3wrw',
  shared: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHcKR084EVuJDItBQF3GNbvlZ6Tjqg_iIQYTR0PNdn1z867yH5aYvmNur0a4lykzl4SBXBNlihMoubcjyeAfmqUDRNnSVZPb27nO19JRcmzl7ej881bZvH8QxEJTNYHiCogivpGGr6YW6_RF_H8KvASZOjB2tm2WWiEVLd1lQ2Bi1rX0RSu4BlKX1ZtuvCZqpO0xSSub8qxlYe9WztJbuuCSaCoypFRSY0e7R28mEgzkzevKpeL0C6vIERzS2TR4hh8J6DH6wJBbA',
  facade: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5QiINDU2WjY5JjKN8qqvtuG6ncwFfOkJueZqCMrKS7yrZyXeTwh4kCOZqYfCpTijPEbF20DBWe1qYfpzhbxx9ufBhRNkZarVm9PKEns_PvpW-N373wjD8DvXQ_BDbGmcH6wW453vCTmuCPRG9N5_BSkux-RIuDU8BxFlETa9uLZ28R3BGUhbWTPTLLtYRFkB2bpAuLLHhSqkk2HWAAc4rcPJ1A5zOqMrs7sZ3AvkABPSuxP7w31uSMX6DmMnp4HmOM7pvbvso2C0',
  bedroom: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmxzSFC7EN1wvaFNvU4CXVxPzaetiYiSr5F9c4A3k4uwUKxMXTXkvV3ziydkEvjw2sc6lAtzfKZ4ZenUGMSmtAHwTnWDFD69-S2QsDlkVlHDCdcA5tG9c6s0IgXtlC2BYMEokbOHxuw9TRTUElRK7c_osOMLQTUOt59EzWoXnr8lxsLbEMYjnWs6Ustl2GiZBXtThCaMFCKz2Fl04PzS0jxMGxm8ZHWNXiIjOQvwukG9mTPkN_7FMJnjkhPN1TPPQcJDhkVVszWmw',
  kitchen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1CRYTT_vfR9GpFUNguHC5O3u7yGi00spoiHeXsJtbwyrNxa5ZWuRMFtAxBeX7a0JMdn6u7fNhwmo6-OJyxVAUN1dIUsW45j3eYoTRaLBPvmv4mfKbv5BCBozZyYCv00qFVz_UTVS2sQLQFDXDGTJAw3FdcgAHtQgg5iufQ-ywmWiNEJTQ5cVvR824ZTRFc5syi5RsEqjaSKsD8NrGIcac1nT70QiyQOSvFwNBD9me8WBPGWg3uxyJY1xiP26Cz8l9za4PZDBsFLg',
  lounge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrScKfQdiZinkEUFfOWCPf9uFGRxkOz-kSEdEPsunv8DQokfJQIz4INsVPLPAa37p3Anzjh8Tg15vvn1FnFGoLfI5jK0XFs51gYH8ywXy_xtyKdyifB4OYXt-QcBVXZrR2n7DcYciWMdYGEJeDMwdcqXjlv8QMhJyR61XgAqyCrC6j52QSTcB_sZaqLQu3kOFlLTePuBapsGdUxz4ZATlgGx0TPpMOdwtACA4uWIpIff7P4M9QqsN5jG4aqKcDCucEUN1zsKRd-Hc',
  courtyard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfwqrd-McN8dZ2fdZMltl6WpLqpZ3k-LsO5uVQs51DNZFMKb9Lz7oHY1KPZWT_Yhx2vrRIIwVKZvAfMy58Z7CLPZpL6Uh7PfldogUx2htkZ2ow6chvh7tUKh5TGw1v-e_hODk0BcFvB48e-ATOxcmDaCcInU4e8bbYotbXfRXbynNN-Kwv-OZso154Cit16L-l7A1WEjWuSGdpF7ryyDbSHr3haOfPeDAIPGbcDwnwdd5adS33w3uuGOm5Gxwl3R5ltTGmGW5gmRw',
  ownerSuite: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZsMout9YIVEfvsVG5yw0n1xdFQFSyb1WUaYm5GWuLBPyxFMAxASleaUkV4-7Z_0s9PBC8CTa_swiLg5o6GYkSjebWUcg86ct2sz08DskGpZDrtIOT1W1lrC51JqrcKAU1OdAyhhHEuRPWT5-lWE8h1m1Flsvemk0wZgOOjVQvwpCVUqPXqfPrridcxt670bbNNrXL2-TkdqVKuWpBecC5Dz1WCbpP2M_6YoYUSmd08jrb5IbJ-Qx8qxMYPHKwmPRF1v8tRcWwY0k',
  ownerLoft: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp9ARqExDFuNoc-rZkCKVAOzCaxPRSaF0YJr3BHrKqdvMTe-FpUUcG0FU94DSgqwHeoHYjeZQ4Rn4m1Kw_iHVQKeSBO0cK6crgPbcL7P0lE2ylbogsemuUro_8BKx8LRAs4jaSob1TzCVsvGoz_C_cu5VDmOZYFn0ns8vs4x6DiSwy7sYlnCScDUH0Txbd2ewvYTki-gAEJ9qtxcqOlOak78JQNyT9E9Afx6aYyXV0JuRvtRo5nOb5xYBm0uVh5U8_WT6xwzdH2W8',
  home1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFnJzGVjYGpqVnFwBH7CPH5CRI_ynv2fWrcNfFKWU5NKvG9rcCcesJvQAZ9sGGxqm4bbKD6tD4PPvBydz2LlSE1qPlCsgrXpGzQfSKW4PjEs4u6TuCS9UGFqFdsOsBWoinUjY7Pa4yFVEkelwJ11839ayVZuQ-N5XgZWGtMhdyu3SlgwXG5lzLWee6Y1E9N4IzxP0w-XxcfIPHExVQeEqC7M5XqBMDmBh5zBpU7xfyVYTa36rqMM2a_EpW1Aqi_DCoW3u32pQdEP8',
  home2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_BlGd-cHL3w6FuLgW1iHneJsDi7z56gMN0HWz85KBbGeUMTpCmA71fHcbJbjhq6sOjFnuTY2en07c6r5oNAyZIEa_4gmPG9D3NPc1kxCdco0g8vJoK1hkXXDZCgMvwuVjwXzAwXpOnjEOOczgJL5tE0uEW9CiL62wKmcHLCxcFDGpZLezded4l_-bpqH1CMy81TiOvpbYAMnUzdl3MYt-dtmFUDzifPrw1-kLsIzhg_kmHPY38yPhPT3AnKB66qb3qLwqRh1q2I',
  home3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT4oLNgnRA4BblWL06-xxa3G2yvXFWQDo6k6M8VmgmWJ_hBW_DdEYj5kxnmnTlMHyoes_3ZbbK5Bxjz5E2QTlbdgeJnPt6RBPPDu7umSM_SyYhZOypOUsF_3PDBFce808E9kk4e76FZ02PWETjNzZ5d0UtQE4tgRSpxcRybwWtYceFMvcNJKP5gbQ1wT_B0d2TG2NqmPAMz4brAId23FIcXDQPK-mGcxu05CRKpv6SB0kbMaT8_ApN_l8YBtjlUTYIchGyH7goqq4',
  sdCard1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iu8BUxO6CxbdtCsi2f2bVpsGgc-vgDi6_mwuiISnXNYbps7nV9v-8Wbt6O-FVDuWAjqhfjeyts5TyQsoh3J34nsgbb6300emKu7xBMIpZxUQM4PUDj_nZ3_Hh2ARW6tmbExFwfeonOw_U_uVozF3SjyKQJ8Zqzb7rKYC87khXLFJoBd9ldqVrYu5hPGd3az6Bq8I2yQyb7BTBSVD6whvLs86vH8XazJLgU5-j9PEg5VAmYs5cddoYnVrD8J7SBVWcC86_n1ph0Q',
  sdCard2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5n4WNehPe6sziSfeeXj-lhyE4vzhk-EgRyXf5kq7G-xHJcYrUYJ7zhm5S4JCDxzFScMi-kavOnVYbEWKcO2iQCpigpfScGXLjshT5XYjMnHUx2E4au0KQjMRisNuND1MCgYBYZpSIJQmrxgGiKJBWRBN0l-ldIUxYc1Buahd4NXM7Ls7eDjyATMvC7vynL6fKO33i0P11qIi_AFrR-ZxQJTNyU-jWVHkzxLNGplgNnwVkCkBp74G4k0QuwIbAwVdJg2idGszYFV4',
};

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await Listing.deleteMany({});
  await Favorite.deleteMany({});
  await Message.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const hashed = await bcrypt.hash('password123', 10);
  const [rahul, priya, student] = await User.create([
    { name: 'Arthur Sterling', email: 'rahul@example.com', password: hashed, phone: '+1-555-0101', role: 'owner' },
    { name: 'James Sterling', email: 'priya@example.com', password: hashed, phone: '+1-555-0102', role: 'owner' },
    { name: 'Alex Johnson', email: 'student@example.com', password: hashed, phone: '+1-555-0103', role: 'student' }
  ]);
  console.log('👤 Created demo users');

  const listings = await Listing.create([
    {
      owner: rahul._id, propertyName: 'Oxford Gardens Premium Hostel', propertyType: 'Hostel',
      address: '124 Baker Street, North Campus Academic Zone, London', city: 'London',
      description: 'A premium student hostel offering world-class amenities and a dedicated study environment with 24/7 security.',
      images: [IMG.facade, IMG.bedroom, IMG.kitchen, IMG.lounge, IMG.courtyard],
      roomConfigs: [
        { occupancy: 'Double Sharing', priceMonthly: 1250, deposit: 2500, availableUnits: 5 },
        { occupancy: 'Private Suite', priceMonthly: 1800, deposit: 3600, availableUnits: 2 },
        { occupancy: 'Triple Sharing', priceMonthly: 950, deposit: 1900, availableUnits: 8 }
      ],
      amenities: ['High-speed WiFi', 'Air Conditioning', 'Professional Laundry', 'Gourmet Meals', 'Power Backup', 'Smart Security'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'filling_fast',
      distanceFromCampus: '0.2 miles from campus', deposit: 2500, verified: true, views: 342,
      policies: [
        { icon: 'schedule', title: 'Curfew Hours', description: 'Residents must return by 11:00 PM on weekdays and 12:30 AM on weekends for security verification.' },
        { icon: 'group', title: 'Visitor Policy', description: 'Visitors are allowed in common areas from 10:00 AM to 8:00 PM. No overnight stay for guests without prior approval.' }
      ]
    },
    {
      owner: rahul._id, propertyName: 'The Scholars Retreat PG', propertyType: 'Paying Guest (PG)',
      address: '88 Stanford Avenue, Palo Alto', city: 'Palo Alto',
      description: 'A high-end student accommodation offering luxury amenities and a dedicated study environment.',
      images: [IMG.room1, IMG.bedroom, IMG.kitchen, IMG.lounge],
      roomConfigs: [
        { occupancy: 'Double Sharing', priceMonthly: 450, deposit: 900, availableUnits: 3 },
        { occupancy: 'Single Sharing', priceMonthly: 650, deposit: 1300, availableUnits: 2 }
      ],
      amenities: ['High-speed WiFi', 'Air Conditioning', 'Daily Cleaning', 'Gourmet Meals'],
      status: 'published', featured: true, gender: 'Male', availability: 'available',
      distanceFromCampus: '0.4 miles from campus', deposit: 900, verified: true, views: 156
    },
    {
      owner: priya._id, propertyName: 'University Hub Hostel', propertyType: 'Hostel',
      address: '45 College Road, University District, Seattle', city: 'Seattle',
      description: 'Vibrant community-living with shared social spaces and frequent student events.',
      images: [IMG.social, IMG.lounge, IMG.kitchen, IMG.courtyard],
      roomConfigs: [
        { occupancy: 'Triple Sharing', priceMonthly: 320, deposit: 500, availableUnits: 2 }
      ],
      amenities: ['Air Conditioning', 'High-speed WiFi', 'Laundry Service', 'Daily Cleaning'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'filling_fast',
      distanceFromCampus: '1.2 miles from campus', deposit: 500, verified: false, views: 89
    },
    {
      owner: priya._id, propertyName: 'Palo Alto Studio Loft', propertyType: 'Private Apartment',
      address: '300 Silicon Valley Blvd, Palo Alto', city: 'Palo Alto',
      description: 'Independent living for grad students. Fully furnished studio with private kitchenette.',
      images: [IMG.studio, IMG.bedroom, IMG.kitchen],
      roomConfigs: [
        { occupancy: 'Single Sharing', priceMonthly: 850, deposit: 1700, availableUnits: 1 }
      ],
      amenities: ['High-speed WiFi', 'Kitchen', 'Power Backup', 'Parking Space'],
      status: 'published', featured: false, gender: 'Co-ed', availability: 'available',
      distanceFromCampus: '0.8 miles from campus', deposit: 1700, verified: true, views: 210
    },
    {
      owner: rahul._id, propertyName: 'Oakwood Scholars Suite', propertyType: 'Private Apartment',
      address: '242 University Ave, Cambridge', city: 'Cambridge',
      description: 'Premium studio apartment with modern furnishings and study space.',
      images: [IMG.ownerSuite, IMG.bedroom, IMG.lounge, IMG.kitchen],
      roomConfigs: [
        { occupancy: 'Single Sharing', priceMonthly: 850, deposit: 1700, availableUnits: 4 }
      ],
      amenities: ['High-speed WiFi', 'Air Conditioning', 'Smart Security'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'available',
      distanceFromCampus: '0.3 miles from campus', deposit: 1700, verified: true, views: 284
    },
    {
      owner: rahul._id, propertyName: 'Highland Shared Loft', propertyType: 'Shared Flat',
      address: '12 Terrace Heights, London', city: 'London',
      description: 'Spacious shared accommodation with meal plans and all bills included.',
      images: [IMG.ownerLoft, IMG.social, IMG.kitchen, IMG.courtyard],
      roomConfigs: [
        { occupancy: 'Triple Sharing', priceMonthly: 1200, deposit: 2400, availableUnits: 1 }
      ],
      amenities: ['Gourmet Meals', 'High-speed WiFi', 'Power Backup', 'Professional Laundry'],
      status: 'published', featured: false, gender: 'Male', availability: 'filling_fast',
      distanceFromCampus: '1.5 miles from campus', deposit: 2400, verified: false, views: 67
    },
    {
      owner: priya._id, propertyName: 'Creekview Paying Guest', propertyType: 'Paying Guest (PG)',
      address: '567 Creek Lane, Palo Alto', city: 'Palo Alto',
      description: 'Affordable and comfortable shared housing with essential amenities provided.',
      images: [IMG.shared, IMG.bedroom, IMG.kitchen],
      roomConfigs: [
        { occupancy: 'Triple Sharing', priceMonthly: 280, deposit: 400, availableUnits: 6 }
      ],
      amenities: ['High-speed WiFi', 'Daily Cleaning'],
      status: 'published', featured: false, gender: 'Female', availability: 'available',
      distanceFromCampus: '1.5 miles from campus', deposit: 400, verified: false, views: 45
    },
    {
      owner: priya._id, propertyName: 'The Graduate Suites', propertyType: 'Hostel',
      address: '14 Lincoln Square, Cambridge', city: 'Cambridge',
      description: 'Premium hostel for graduate students with dedicated study rooms and meal plans.',
      images: [IMG.home1, IMG.bedroom, IMG.lounge, IMG.kitchen],
      roomConfigs: [
        { occupancy: 'Single Sharing', priceMonthly: 850, deposit: 1700, availableUnits: 3 }
      ],
      amenities: ['High-speed WiFi', 'Gourmet Meals', 'Smart Security', 'Air Conditioning'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'available',
      distanceFromCampus: '0.5 miles from campus', deposit: 1700, verified: true, views: 512
    },
    {
      owner: rahul._id, propertyName: 'Urban Nest Co-Living', propertyType: 'Shared Flat',
      address: '89 University District, Seattle', city: 'Seattle',
      description: 'Modern co-living space with shared amenities and social events for students.',
      images: [IMG.home2, IMG.social, IMG.lounge, IMG.kitchen],
      roomConfigs: [
        { occupancy: 'Double Sharing', priceMonthly: 620, deposit: 1240, availableUnits: 2 }
      ],
      amenities: ['Air Conditioning', 'Laundry Service', 'High-speed WiFi'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'filling_fast',
      distanceFromCampus: '0.6 miles from campus', deposit: 1240, verified: true, views: 198
    },
    {
      owner: priya._id, propertyName: 'Ivy Hall Residences', propertyType: 'Hostel',
      address: '7 Heritage Row, Boston', city: 'Boston',
      description: 'Upscale private rooms with 24/7 security, gym, and parking included.',
      images: [IMG.home3, IMG.facade, IMG.bedroom, IMG.courtyard],
      roomConfigs: [
        { occupancy: 'Single Sharing', priceMonthly: 1200, deposit: 2400, availableUnits: 1 }
      ],
      amenities: ['Smart Security', 'Gym', 'Parking Space', 'High-speed WiFi'],
      status: 'published', featured: true, gender: 'Co-ed', availability: 'available',
      distanceFromCampus: '0.3 miles from campus', deposit: 2400, verified: true, views: 378
    }
  ]);
  console.log(`🏠 Created ${listings.length} demo listings`);

  // Add favorites for student
  await Favorite.create([
    { user: student._id, listing: listings[0]._id },
    { user: student._id, listing: listings[4]._id }
  ]);

  // Add messages
  await Message.create([
    { sender: student._id, receiver: rahul._id, listing: listings[4]._id, content: 'Interested in Oakwood Suite for Fall Semester. Is it still available?', status: 'responded' },
    { sender: student._id, receiver: priya._id, listing: listings[3]._id, content: 'Is the WiFi speed good enough for gaming?', status: 'pending' },
    { sender: student._id, receiver: rahul._id, listing: listings[5]._id, content: 'Requesting a virtual tour this Friday if possible.', status: 'pending' }
  ]);

  console.log('\n✅ Seed data created successfully!');
  console.log('\n📧 Demo Accounts:');
  console.log('   Owner: rahul@example.com / password123');
  console.log('   Owner: priya@example.com / password123');
  console.log('   Student: student@example.com / password123\n');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
