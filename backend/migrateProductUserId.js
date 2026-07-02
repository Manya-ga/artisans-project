require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('--- STARTING MIGRATION ---');
  
  // 1. Fetch all products
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) throw prodError;

  // 2. Fetch all artisans
  const { data: artisans, error: artError } = await supabase.from('artisans').select('id, name');
  if (artError) throw artError;

  console.log(`Total Products: ${products.length}`);
  
  let validLinks = 0;
  let missingLinks = 0;
  let fixedLinks = 0;

  for (let prod of products) {
    if (prod.user_id && prod.user_id !== '00000000-0000-0000-0000-000000000000') {
      validLinks++;
    } else {
      missingLinks++;
      // Try to match by artisan_name
      const match = artisans.find(a => a.name === prod.artisan_name);
      if (match) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ user_id: match.id })
          .eq('id', prod.id);
        
        if (!updateError) {
          fixedLinks++;
        } else {
          console.error(`Failed to update product ${prod.id}:`, updateError);
        }
      }
    }
  }

  console.log('--- MIGRATION REPORT ---');
  console.log(`Total Products Evaluated: ${products.length}`);
  console.log(`Products with Valid user_id originally: ${validLinks}`);
  console.log(`Products missing user_id originally: ${missingLinks}`);
  console.log(`Products successfully fixed/migrated: ${fixedLinks}`);
  console.log(`Products still missing user_id: ${missingLinks - fixedLinks}`);
  console.log('--- MIGRATION COMPLETE ---');
}

migrate().catch(console.error);
