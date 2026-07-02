const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'local_db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function runAuditAndRepair() {
  console.log('--- DATABASE AUDIT & REPAIR START ---');
  const db = readDb();
  
  if (!db.users) db.users = [];
  if (!db.profiles) db.profiles = [];
  if (!db.artisans) db.artisans = [];
  if (!db.products) db.products = [];

  console.log(`Initial Stats:`);
  console.log(`- Users: ${db.users.length}`);
  console.log(`- Profiles: ${db.profiles.length}`);
  console.log(`- Artisans: ${db.artisans.length}`);
  console.log(`- Products: ${db.products.length}`);

  let migratedArtisansCount = 0;
  let linkedProductsCount = 0;
  let orphanedProductsCount = 0;
  let deletedOrphanedCount = 0;

  // 1. Migrate Artisans to Profiles/Users if needed
  db.artisans.forEach(artisan => {
    let profile = db.profiles.find(p => p.id === artisan.id || p.display_name === artisan.name);
    if (!profile) {
      // Create user record for auth
      const email = `${artisan.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'artisan'}@example.com`;
      
      // We only create a profile since that's what the directory reads, but to be safe, a user too.
      let user = db.users.find(u => u.email === email);
      if (!user) {
        user = {
          id: artisan.id || crypto.randomUUID(),
          email: email,
          password_hash: '$2b$10$ep/0tW2M/9L9.r3zS.ZJtu5.Xp.jLw3y1a5l7g.uR0s5V7A3u8.e6', // generic hash for 'password'
          user_metadata: { display_name: artisan.name },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.users.push(user);
      }

      // Create profile
      profile = {
        id: user.id,
        email: user.email,
        display_name: artisan.name,
        role: 'artisan',
        bio: artisan.bio || artisan.tagline || '',
        photo_url: artisan.image,
        location: artisan.location || 'India',
        category: artisan.category || 'Handicrafts', // Extra field
        rating: artisan.rating || 5.0, // Extra field
        wishlist: [],
        followers: [],
        following: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.profiles.push(profile);
      migratedArtisansCount++;
    } else {
      // Update existing profile with artisan data just in case
      profile.photo_url = profile.photo_url || artisan.image;
      profile.bio = profile.bio || artisan.bio || artisan.tagline;
      profile.location = profile.location || artisan.location;
      profile.role = 'artisan';
    }
    
    // Ensure ID matches
    artisan.id = profile.id;
  });

  // 2. Map Products to Artisans via user_id
  const validProducts = [];
  
  db.products.forEach(product => {
    let linkedProfile = null;
    
    // Try to link by user_id first
    if (product.user_id) {
      linkedProfile = db.profiles.find(p => p.id === product.user_id && p.role === 'artisan');
    }
    
    // Fallback: Link by artisan name
    if (!linkedProfile && (product.artisanName || product.artisan_name)) {
      const name = product.artisanName || product.artisan_name;
      linkedProfile = db.profiles.find(p => p.display_name === name && p.role === 'artisan');
    }
    
    if (linkedProfile) {
      product.user_id = linkedProfile.id;
      product.artisanName = linkedProfile.display_name;
      product.artisan_name = linkedProfile.display_name;
      validProducts.push(product);
      linkedProductsCount++;
    } else {
      orphanedProductsCount++;
      deletedOrphanedCount++;
    }
  });

  // Overwrite products with only valid ones
  db.products = validProducts;

  // 3. Optional: Sync back artisan collection (or drop it later once fully migrated, but leaving for now as DiscoverMakersPage relies on it)
  // Let's ensure db.artisans correctly matches db.profiles where role='artisan'
  db.artisans = db.profiles.filter(p => p.role === 'artisan').map(p => ({
    id: p.id,
    name: p.display_name,
    category: p.category || 'Handicrafts',
    image: p.photo_url,
    rating: p.rating || 5.0,
    tagline: p.bio?.substring(0, 50),
    bio: p.bio,
    location: p.location
  }));

  writeDb(db);

  console.log(`\n--- REPAIR RESULTS ---`);
  console.log(`- Artisans Migrated to Profiles: ${migratedArtisansCount}`);
  console.log(`- Products Linked to valid artisans: ${linkedProductsCount}`);
  console.log(`- Orphaned Products Found: ${orphanedProductsCount}`);
  console.log(`- Orphaned Products Deleted: ${deletedOrphanedCount}`);
  console.log(`\nFinal Stats:`);
  console.log(`- Profiles (Role=Artisan): ${db.profiles.filter(p => p.role === 'artisan').length}`);
  console.log(`- Artisans table: ${db.artisans.length}`);
  console.log(`- Products: ${db.products.length}`);
  console.log('--- DATABASE AUDIT & REPAIR COMPLETE ---');
}

runAuditAndRepair();
