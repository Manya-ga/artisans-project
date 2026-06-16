const fs = require('fs');
const path = require('path');
const { artisans, products } = require('./src/data');
const crypto = require('crypto');

const dbPath = path.resolve(__dirname, 'local_db.json');

function syncLocalDb() {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Map artisans
  const newArtisans = artisans.map(a => ({
    id: crypto.randomUUID(),
    legacy_id: a.id,
    name: a.name,
    category: a.category,
    image: a.image,
    rating: a.rating,
    tagline: a.tagline,
    bio: a.bio,
    location: a.location,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  db.artisans = newArtisans;

  // 2. Map profiles
  const newProfiles = artisans.map(a => ({
    id: crypto.randomUUID(),
    display_name: a.name,
    email: `artisan${a.id}@artisan.com`,
    bio: a.bio,
    photo_url: a.image,
    location: a.location,
    followers: [],
    following: [],
    wishlist: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  db.profiles = newProfiles;

  // 3. Map products
  const newProducts = products.map(p => {
    // Find matching profile for user_id
    const artisanProfile = newProfiles.find(prof => prof.email === `artisan${p.artisanId}@artisan.com`);
    
    return {
      id: crypto.randomUUID(),
      legacy_id: p.id,
      user_id: artisanProfile ? artisanProfile.id : crypto.randomUUID(),
      title: p.name,
      price: p.price,
      description: null,
      image: p.image,
      images: [],
      category: p.category,
      artisan_name: p.artisanName,
      artisan_image: p.artisanImage,
      artisan_location: p.artisanLocation,
      stock: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  db.products = newProducts;

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Successfully synced local_db.json with new Indian data!');
}

syncLocalDb();
