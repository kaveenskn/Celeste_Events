import { NextResponse } from 'next/server';

const HOTELS = [
  {
    name: 'The Grand Meridian',
    location: 'Colombo 03, Sri Lanka',
    description: 'An iconic luxury hotel nestled in the heart of Colombo, offering breathtaking Indian Ocean views and an unparalleled event experience. Our grand ballroom accommodates up to 500 guests with state-of-the-art AV equipment, a dedicated bridal suite, a catering kitchen run by award-winning chefs, and a team of professional event planners ready to transform your vision into an extraordinary reality.',
    basePrice: 5000,
    capacity: 500,
    status: 'approved',
    rating: 4.9,
    reviewCount: 187,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2400&q=85',
    amenities: ['Grand Ballroom','Rooftop Terrace','Infinity Pool','Valet Parking','Full AV Suite','Bridal Suite','Catering Kitchen','Dedicated Planner','Backup Generator','Free Wi-Fi'],
  },
  {
    name: 'Kandy Hills Resort',
    location: 'Kandy, Sri Lanka',
    description: 'Perched among the misty hills of Kandy, this heritage resort offers a magical setting for weddings and corporate events. Surrounded by lush tea gardens and overlooking the sacred city, every event becomes an unforgettable journey. The resort blends colonial charm with modern comforts — open-air pavilions, bonfire terraces, and authentic Sri Lankan cultural experiences included.',
    basePrice: 3500,
    capacity: 300,
    status: 'approved',
    rating: 4.6,
    reviewCount: 124,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=85',
      'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=2400&q=85',
    amenities: ['Garden Pavilion','Tea Garden Views','Heritage Spa','Traditional Cuisine','Cultural Shows','Bonfire Terrace','Nature Walks','Colonial Architecture'],
  },
  {
    name: 'Galle Fort Palace',
    location: 'Galle, Sri Lanka',
    description: 'A colonial masterpiece within the UNESCO World Heritage-listed Galle Fort, transformed into an exclusive event venue. The cobblestone courtyards, Dutch colonial archways, and whitewashed walls create a breathtaking backdrop for intimate gatherings. Every corner tells centuries of history while offering all modern conveniences for your perfect celebration.',
    basePrice: 4200,
    capacity: 200,
    status: 'approved',
    rating: 4.8,
    reviewCount: 96,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1537639622086-7d0ad12e1fbb?w=1200&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200&q=85',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=2400&q=85',
    amenities: ['Stone Courtyard','Ocean Terrace','Colonial Ballroom','Fort Rampart Views','Sunset Deck','Heritage Library','Candlelit Dining','Vintage Décor'],
  },
  {
    name: 'Mirissa Oceanfront Estate',
    location: 'Mirissa, Sri Lanka',
    description: 'A contemporary beachfront venue where the Indian Ocean meets luxury. Perfect for beach weddings, corporate retreats, and sunset galas. Wake up to whale sightings and celebrate under a canopy of stars with the rhythm of waves as your soundtrack. The estate features a private beach, an infinity pool overlooking the ocean, and a world-class culinary team.',
    basePrice: 6000,
    capacity: 400,
    status: 'approved',
    rating: 4.7,
    reviewCount: 152,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=85',
    amenities: ['Private Beach','Infinity Pool','Beach Bar','Sunset Deck','Water Sports','Fine Dining','Whale Watching','Bonfire Pit','Beachside Pavilion'],
  },
  {
    name: 'Ella Mountain Lodge',
    location: 'Ella, Sri Lanka',
    description: 'Nestled at 1,200m above sea level amid rolling tea estates and dramatic rock formations, Ella Mountain Lodge is an intimate luxury venue for exclusive events. The nine-arch bridge backdrop and misty valley views make every photograph breathtaking. Perfect for romantic elopements, anniversary celebrations, and exclusive corporate retreats.',
    basePrice: 2800,
    capacity: 150,
    status: 'approved',
    rating: 4.5,
    reviewCount: 78,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&q=85',
    amenities: ['Mountain Views','Tea Estate Tours','Outdoor Terraces','Firepit Lounge','Trekking Trails','Organic Garden','Local Cuisine','Stargazing Deck'],
  },
  {
    name: 'Colombo Skyline Rooftop',
    location: 'Colombo 07, Sri Lanka',
    description: 'The city\'s most prestigious rooftop venue, 32 floors above Colombo\'s skyline with 360-degree panoramic views. This sleek, modern space is ideal for corporate product launches, cocktail receptions, and high-profile social events. The retractable glass roof means your event is never at the mercy of the weather — rain or shine, the views are always spectacular.',
    basePrice: 7500,
    capacity: 350,
    status: 'approved',
    rating: 4.8,
    reviewCount: 61,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=85',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85',
    ],
    image360: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2400&q=85',
    amenities: ['360° Panoramic Views','Retractable Glass Roof','LED Dance Floor','Premium Bar','Cocktail Lounge','Valet Parking','AV & Lighting','Event Coordinator','Helipad Access'],
  },
];

const MENU_TEMPLATES = [
  // ── Appetisers ──
  { name: 'Coconut Prawn Skewers',     description: 'Grilled tiger prawns with fresh coconut marinade, lime wedge and house chilli dip', pricePerPlate: 18, category: 'appetizer', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
  { name: 'Sri Lankan Bruschetta',      description: 'Toasted sourdough with fresh tomato, red onion, coriander and green chilli sambol', pricePerPlate: 12, category: 'appetizer', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&q=80' },
  { name: 'Crab Cakes',                 description: 'Pan-seared blue swimmer crab cakes with spiced mango aioli and micro herb salad',     pricePerPlate: 22, category: 'appetizer', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
  { name: 'Stuffed Mushrooms',          description: 'Portobello mushrooms filled with cream cheese, garlic, and smoked paprika crumble',    pricePerPlate: 14, category: 'appetizer', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' },
  { name: 'Chicken Satay Skewers',      description: 'Tender chicken marinated in turmeric and lemongrass, served with peanut sauce',        pricePerPlate: 16, category: 'appetizer', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&q=80' },
  // ── Mains ──
  { name: 'Saffron Chicken Biryani',    description: 'Fragrant basmati rice with tender chicken, saffron threads, caramelised onions and raita', pricePerPlate: 35, category: 'main', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96d?w=500&q=80' },
  { name: 'Grilled Sea Bass',           description: 'Whole sea bass with ginger-garlic herb crust, coconut rice and curry leaf butter',      pricePerPlate: 48, category: 'main', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500&q=80' },
  { name: 'Lamb Kottu Roti',            description: 'Traditional Sri Lankan kottu with slow-cooked lamb shoulder, vegetables and egg',       pricePerPlate: 30, category: 'main', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80' },
  { name: 'Vegetarian Dhal Curry',      description: 'Creamy red lentil curry with tempered mustard and spices, served with string hoppers',  pricePerPlate: 20, category: 'main', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80' },
  { name: 'Beef Tenderloin',            description: 'Grass-fed beef tenderloin with red wine jus, roasted vegetables and truffle mash',      pricePerPlate: 58, category: 'main', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
  { name: 'Lobster Thermidor',          description: 'Whole lobster baked with brandy cream sauce, Gruyère and fresh herbs — a true showpiece', pricePerPlate: 75, category: 'main', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80' },
  { name: 'Mushroom Risotto',           description: 'Arborio rice slow-cooked with wild mushrooms, white wine, parmesan and fresh thyme',    pricePerPlate: 28, category: 'main', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&q=80' },
  // ── Desserts ──
  { name: 'Watalappan Custard',         description: 'Traditional jaggery coconut custard topped with cashews, cardamom and pandan leaf',     pricePerPlate: 14, category: 'dessert', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
  { name: 'Mango Pannacotta',           description: 'Silky cream dessert with fresh Alphonso mango coulis, mint oil and sesame tuile',       pricePerPlate: 16, category: 'dessert', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80' },
  { name: 'Chocolate Lava Cake',        description: 'Warm dark chocolate fondant with molten centre, vanilla ice cream and berry compote',   pricePerPlate: 18, category: 'dessert', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80' },
  { name: 'Creme Brulee',               description: 'Classic French vanilla custard with a perfectly caramelised sugar crust and fresh berries', pricePerPlate: 15, category: 'dessert', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500&q=80' },
  // ── Beverages ──
  { name: 'Ceylon Tea Service',         description: 'Premium single-estate high-grown Ceylon tea with milk, honey, lemon and shortbread',    pricePerPlate: 8,  category: 'beverage', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80' },
  { name: 'Tropical Juice Station',     description: 'King coconut, passion fruit, mango, watermelon and pineapple fresh-pressed juices',    pricePerPlate: 10, category: 'beverage', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80' },
  { name: 'Mocktail Cocktail Bar',      description: 'Craft mocktails — coconut mojito, passion fruit daiquiri, lychee lemonade and more',   pricePerPlate: 15, category: 'beverage', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&q=80' },
  { name: 'Premium Coffee Station',     description: 'Barista-served espresso, cappuccino, latte and cold brew with Ceylon single origin beans', pricePerPlate: 12, category: 'beverage', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80' },
];

export async function POST() {
  try {
    const { default: connectDB } = await import('@/lib/mongodb');
    await connectDB();
    const { default: Hotel }    = await import('@/models/Hotel');
    const { default: MenuItem } = await import('@/models/MenuItem');
    const { default: Availability } = await import('@/models/Availability');

    // Clear old data
    await Hotel.deleteMany({});
    await MenuItem.deleteMany({});
    await Availability.deleteMany({});

    // Insert hotels
    const hotels = await Hotel.insertMany(HOTELS);

    // Insert menus — all items for every hotel
    const menuDocs = [];
    for (const hotel of hotels) {
      for (const t of MENU_TEMPLATES) {
        menuDocs.push({ ...t, hotelId: hotel._id });
      }
    }
    await MenuItem.insertMany(menuDocs);

    // Seed availability — mark a few dates as booked for realism
    const availDocs = [];
    const today = new Date();
    for (const hotel of hotels) {
      for (let d = 0; d < 90; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];
        // Randomly mark ~15% as booked
        const status = Math.random() < 0.15 ? 'booked' : 'available';
        availDocs.push({ hotelId: hotel._id, date: dateStr, status });
      }
    }
    await Availability.insertMany(availDocs);

    return NextResponse.json({
      message: '✓ Database seeded successfully',
      hotels: hotels.length,
      menuItems: menuDocs.length,
      availabilityDays: availDocs.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Seed failed: ${msg}` }, { status: 500 });
  }
}
