require('dotenv').config();
const supabase = require('./src/config/supabase');
const { products } = require('./src/data');

async function updateProductImages() {
  console.log('Updating product images...');
  for (const item of products) {
    const { error } = await supabase
      .from('products')
      .update({ image: item.image })
      .eq('legacy_id', item.id);
    
    if (error) {
      console.error(`Failed to update product ${item.id}:`, error.message);
    } else {
      console.log(`Updated product ${item.id}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}

updateProductImages();
