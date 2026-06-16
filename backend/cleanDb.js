require('dotenv').config();
const supabase = require('./src/config/supabase');

async function cleanDatabase() {
  console.log('Cleaning non-Indian products and artisans...');

  try {
    // Keep only products with legacy_id from 1 to 15
    const { data: allProducts, error: pGetError } = await supabase.from('products').select('id, legacy_id');
    if (allProducts) {
      for (const p of allProducts) {
        if (!p.legacy_id || p.legacy_id > 15 || p.legacy_id < 1) {
          await supabase.from('products').delete().eq('id', p.id);
          console.log(`Deleted non-Indian product: ${p.id}`);
        }
      }
    }

    // Keep only artisans with legacy_id from 1 to 10
    const { data: allArtisans, error: aGetError } = await supabase.from('artisans').select('id, legacy_id');
    if (allArtisans) {
      for (const a of allArtisans) {
        if (!a.legacy_id || a.legacy_id > 10 || a.legacy_id < 1) {
          await supabase.from('artisans').delete().eq('id', a.id);
          console.log(`Deleted non-Indian artisan: ${a.id}`);
        }
      }
    }

    console.log('Database cleanup complete!');
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
}

cleanDatabase();
