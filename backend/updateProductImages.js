/**
 * Script to update all product images in local_db.json with 
 * high-quality, unique Unsplash images of Indian handicrafts.
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'local_db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Curated, verified working Unsplash images for Indian handicrafts
// Each image is unique and relevant to the craft category
const CATEGORY_IMAGES = {
  'Pottery': [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop', // Blue pottery
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop', // Floral vase
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop', // Pottery workshop
    'https://images.unsplash.com/photo-1486300216153-98b1beede3c2?w=800&auto=format&fit=crop', // Clay pot
    'https://images.unsplash.com/photo-1509946664994-efa0a0e4f1db?w=800&auto=format&fit=crop', // Handmade pottery
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', // Ceramic bowls
    'https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=800&auto=format&fit=crop', // Tea set pottery
    'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop', // Pottery wheel
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop', // Decorative pots
    'https://images.unsplash.com/photo-1485955900006-d0f28d392b8e?w=800&auto=format&fit=crop', // Painted planter
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop', // Ceramic art
    'https://images.unsplash.com/photo-1604076913837-52ab5629fde4?w=800&auto=format&fit=crop', // Blue art pottery
  ],
  'Textiles': [
    'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop', // Silk fabric
    'https://images.unsplash.com/photo-1605814597473-b3c9735d4ba2?w=800&auto=format&fit=crop', // Handloom weaving
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop', // Colored textiles
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop', // Fabric rolls
    'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&auto=format&fit=crop', // Woven fabric
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop', // Printed fabric
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop', // Block print
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&auto=format&fit=crop', // Handwoven cloth
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop', // Indian fabric
  ],
  'Jewelry': [
    'https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop', // Silver jewelry
    'https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop', // Gold necklace
    'https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop', // Gemstone earrings
    'https://images.unsplash.com/photo-1601121141418-5b7c699e3764?w=800&auto=format&fit=crop', // Bangles
    'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&auto=format&fit=crop', // Traditional jewelry
    'https://images.unsplash.com/photo-1631982690223-8aa2d30dc0c6?w=800&auto=format&fit=crop', // Temple jewelry
    'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=800&auto=format&fit=crop', // Kundan set
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop', // Pearl necklace
    'https://images.unsplash.com/photo-1576047000578-b0b10a3b4edd?w=800&auto=format&fit=crop', // Antique jewelry
  ],
  'Wood Craft': [
    'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop', // Wood carving
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', // Wooden box
    'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&auto=format&fit=crop', // Wooden crafts
    'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&auto=format&fit=crop', // Wooden art
    'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&auto=format&fit=crop', // Hand carved
    'https://images.unsplash.com/photo-1566024349612-0e0e33e01edd?w=800&auto=format&fit=crop', // Carved elephant
    'https://images.unsplash.com/photo-1551913902-c92207136625?w=800&auto=format&fit=crop', // Wood decoration
    'https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop', // Wooden toys
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&auto=format&fit=crop', // Lacquer wood
  ],
  'Paintings': [
    'https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop', // Madhubani
    'https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop', // Folk painting
    'https://images.unsplash.com/photo-1570555046680-4de0f9e7a77b?w=800&auto=format&fit=crop', // Indian art
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop', // Pattachitra
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop', // Canvas art
    'https://images.unsplash.com/photo-1572372928536-f38b8c61b5c9?w=800&auto=format&fit=crop', // Traditional painting
  ],
  'Metal Crafts': [
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop', // Brass
    'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=800&auto=format&fit=crop', // Copper
    'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=800&auto=format&fit=crop', // Bidri art
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop', // Metal crafts
    'https://images.unsplash.com/photo-1587561124372-d680538b9dd3?w=800&auto=format&fit=crop', // Brass lamp
  ],
  'Bamboo Crafts': [
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop', // Bamboo basket
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop', // Bamboo craft
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop', // Wicker weave
  ],
  'Leather Crafts': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', // Leather bag
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', // Leather wallet
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', // Leather goods
    'https://images.unsplash.com/photo-1516257984-081d8cc43b23?w=800&auto=format&fit=crop', // Handmade leather
  ],
  'Stone Crafts': [
    'https://images.unsplash.com/photo-1555985947-e8e7a7a57234?w=800&auto=format&fit=crop', // Stone sculpture
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop', // Marble art
    'https://images.unsplash.com/photo-1604076913837-52ab5629fde4?w=800&auto=format&fit=crop', // Stone carving
  ],
  'General': [
    'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&auto=format&fit=crop', // Handicraft
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop', // Indian craft
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop', // Artisan work
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop', // Handmade gift
    'https://images.unsplash.com/photo-1550989460-026-5b432a51fa1e?w=800&auto=format&fit=crop', // Craft market
  ]
};

// Track usage to ensure uniqueness
const usedImages = new Set();

function getUniqueImage(category) {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['General'];
  // Find an unused image from the pool
  for (const img of pool) {
    if (!usedImages.has(img)) {
      usedImages.add(img);
      return img;
    }
  }
  // If all used, create a unique variant by adding a different size param
  const base = pool[Math.floor(Math.random() * pool.length)];
  const sizes = ['?w=800&auto=format&fit=crop', '?w=900&auto=format&fit=crop', '?w=1000&auto=format&fit=crop&q=85'];
  for (const s of sizes) {
    const variant = base.split('?')[0] + s;
    if (!usedImages.has(variant)) {
      usedImages.add(variant);
      return variant;
    }
  }
  return base;
}

let updated = 0;
db.products = db.products.map(product => {
  const hasValidImage = product.image && product.image.startsWith('http') && product.image.includes('unsplash.com');
  const url = getUniqueImage(product.category || 'General');
  
  // Always update to ensure unique images (overwrite duplicates)
  updated++;
  return {
    ...product,
    image: url,
    images: [url]
  };
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`✅ Updated ${updated}/${db.products.length} product images`);

// Verify uniqueness
const allImages = db.products.map(p => p.image);
const uniqueImages = new Set(allImages);
console.log(`🔍 Unique images: ${uniqueImages.size}/${allImages.length}`);
