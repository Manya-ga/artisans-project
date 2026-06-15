require('dotenv').config();
const supabase = require('./src/config/supabase');
const { artisans, products, stories } = require('./src/data');

async function syncDatabase() {
  console.log('Starting full database sync from local data.js...');

  try {
    // 1. Sync Artisans
    console.log(`Syncing ${artisans.length} artisans...`);
    for (const item of artisans) {
      const { error } = await supabase
        .from('artisans')
        .update({
          name: item.name,
          category: item.category,
          image: item.image,
          rating: item.rating,
          tagline: item.tagline,
          bio: item.bio,
          location: item.location
        })
        .eq('legacy_id', item.id);
      
      if (error) console.error(`Error updating artisan ${item.id}:`, error);
    }
    console.log('Artisans synced.');

    // 2. Sync Profiles
    console.log(`Syncing profiles...`);
    for (const item of artisans) {
      let email = `artisan${item.id}@artisan.com`;
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: item.name,
          bio: item.bio,
          photo_url: item.image,
          location: item.location
        })
        .eq('email', email);
      
      if (error) console.error(`Error updating profile ${email}:`, error);
    }
    console.log('Profiles synced.');

    // 3. Sync Products
    console.log(`Syncing ${products.length} products...`);
    // We'll upsert by legacy_id to ensure exactly 15 products exist.
    for (const item of products) {
      let email = `artisan${item.artisanId}@artisan.com`;
      const { data: profileData } = await supabase.from('profiles').select('id').eq('email', email).single();
      
      const payload = {
        title: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        artisan_name: item.artisanName,
        artisan_image: item.artisanImage,
        artisan_location: item.artisanLocation,
      };

      if (profileData && profileData.id) {
        payload.user_id = profileData.id;
      }

      const { data: existingProduct } = await supabase.from('products').select('id').eq('legacy_id', item.id).single();
      
      if (existingProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('legacy_id', item.id);
        if (error) console.error(`Error updating product ${item.id}:`, error);
      } else {
        payload.legacy_id = item.id;
        const { error } = await supabase
          .from('products')
          .insert(payload);
        if (error) console.error(`Error inserting product ${item.id}:`, error);
      }
    }
    
    console.log('Products synced.');
    console.log('Database Sync Complete!');
    process.exit(0);

  } catch (err) {
    console.error('Database Sync Failed:', err);
    process.exit(1);
  }
}

syncDatabase();
