require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getStats() {
  const { data: artisans, error: e1 } = await supabase.from('artisans').select('id, name, location, image');
  const { data: products, error: e2 } = await supabase.from('products').select('id, title, user_id, artisan_name, image, price, category');
  
  if (e1 || e2) {
    console.error(e1, e2);
    return;
  }
  
  console.log(`Total Artisans: ${artisans.length}`);
  console.log(`Total Products: ${products.length}`);
  
  const foreignNames = ['James Chen', 'Maria', 'Carlos', 'Test', 'Mock', 'Dummy'];
  const foreignArtisans = artisans.filter(a => foreignNames.some(fn => a.name.includes(fn)));
  console.log(`Foreign/Mock Artisans: ${foreignArtisans.length}`);
  
  // check how products link to artisans
  const productsWithUserId = products.filter(p => p.user_id);
  console.log(`Products with user_id: ${productsWithUserId.length}`);
  
  if (productsWithUserId.length > 0) {
    const matchedWithUserId = artisans.find(a => a.id === productsWithUserId[0].user_id);
    console.log(`Sample user_id links to artisan: ${!!matchedWithUserId}`);
  }
  
  const productsWithArtisanName = products.filter(p => p.artisan_name);
  console.log(`Products with artisan_name: ${productsWithArtisanName.length}`);
  
  const productCounts = {};
  products.forEach(p => {
    // using user_id if it exists, otherwise artisan_name
    const key = p.user_id || p.artisan_name;
    productCounts[key] = (productCounts[key] || 0) + 1;
  });
  
  let validArtisans = 0;
  artisans.forEach(a => {
    const count = productCounts[a.id] || productCounts[a.name] || 0;
    if (count >= 3 && count <= 8) {
      validArtisans++;
    }
  });
  console.log(`Artisans with 3-8 products: ${validArtisans}`);
}

getStats();
