require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function proveSource() {
  console.log("=== PHASE 1: DATA SOURCE AUDIT ===");
  console.log("Connecting directly to Supabase at: " + process.env.SUPABASE_URL);

  // Get count of artisans
  const { data: artisans, error: aError } = await supabase.from('artisans').select('*');
  if (aError) {
    console.error("Error fetching artisans from Supabase:", aError);
    return;
  }
  
  // Get count of products
  const { data: products, error: pError } = await supabase.from('products').select('*');
  if (pError) {
    console.error("Error fetching products from Supabase:", pError);
    return;
  }

  console.log(`\n[Supabase DB Counts]`);
  console.log(`Total Artisans: ${artisans.length}`);
  console.log(`Total Products: ${products.length}`);

  // Look for James, Maria, Chen, garden in DB
  const oldArtisans = artisans.filter(a => 
    a.display_name.toLowerCase().includes('james') || 
    a.display_name.toLowerCase().includes('maria') || 
    a.display_name.toLowerCase().includes('chen')
  );

  const oldProducts = products.filter(p => 
    p.name.toLowerCase().includes('garden') ||
    (p.description && p.description.toLowerCase().includes('garden'))
  );

  console.log(`\n[Old Data Found in Supabase]`);
  console.log(`Artisans with 'James', 'Maria', or 'Chen': ${oldArtisans.length}`);
  if (oldArtisans.length > 0) {
    oldArtisans.forEach(a => console.log(` - ID: ${a.id}, Name: ${a.display_name}, Category: ${a.category}`));
  }

  console.log(`Products with 'garden': ${oldProducts.length}`);
  if (oldProducts.length > 0) {
    oldProducts.forEach(p => console.log(` - ID: ${p.id}, Name: ${p.name}`));
  }

  console.log(`\n=== AUDIT COMPLETE ===`);
}

proveSource();
