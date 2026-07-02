require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ARTISANS = [
  { name: 'Arjun Desai', category: 'Wood Craft', location: 'Gujarat', tagline: 'Master wood carver', bio: 'Creating intricate wooden artifacts for over 20 years.' },
  { name: 'Meera Reddy', category: 'Textiles', location: 'Andhra Pradesh', tagline: 'Weaving traditions', bio: 'Specializing in Kalamkari and Mangalagiri weaves.' },
  { name: 'Ravi Verma', category: 'Paintings', location: 'Kerala', tagline: 'Colors of life', bio: 'Mural painter reviving ancient temple art.' },
  { name: 'Lakshmi Narayan', category: 'Jewelry', location: 'Rajasthan', tagline: 'Kundan and Meenakari', bio: 'Crafting royal jewelry pieces with precious stones.' },
  { name: 'Sanjay Kumar', category: 'Pottery', location: 'Uttar Pradesh', tagline: 'Earthy creations', bio: 'Khurja pottery artist bringing modern shapes to clay.' },
  { name: 'Priya Sharma', category: 'Textiles', location: 'Punjab', tagline: 'Phulkari specialist', bio: 'Bright threads telling stories on fabric.' },
  { name: 'Vikram Singh', category: 'Metal Crafts', location: 'Madhya Pradesh', tagline: 'Bell metal art', bio: 'Dhokra casting expert creating tribal motifs.' },
  { name: 'Anjali Das', category: 'Paintings', location: 'Odisha', tagline: 'Pattachitra artist', bio: 'Painting mythological tales on cloth.' },
  { name: 'Kiran Patel', category: 'Textiles', location: 'Gujarat', tagline: 'Bandhani expert', bio: 'Tie and dye master creating vibrant patterns.' },
  { name: 'Mohan Lal', category: 'Wood Craft', location: 'Rajasthan', tagline: 'Jali work master', bio: 'Carving delicate wooden screens and furniture.' },
  { name: 'Deepa Gupta', category: 'Jewelry', location: 'Maharashtra', tagline: 'Silver filigree', bio: 'Delicate silver wire work for modern wear.' },
  { name: 'Rajesh Nair', category: 'Wood Craft', location: 'Kerala', tagline: 'Rosewood inlay', bio: 'Creating beautiful scenes with different wood grains.' },
  { name: 'Sunita Devi', category: 'Pottery', location: 'Rajasthan', tagline: 'Blue pottery', bio: 'Jaipur blue pottery artist with floral designs.' },
  { name: 'Amit Banerjee', category: 'Metal Crafts', location: 'West Bengal', tagline: 'Dokra art', bio: 'Lost wax casting technique for unique metal figures.' },
  { name: 'Kavita Iyer', category: 'Textiles', location: 'Tamil Nadu', tagline: 'Kanjivaram weaver', bio: 'Silk sarees with pure zari work.' },
  { name: 'Gopal Krishnan', category: 'Paintings', location: 'Tamil Nadu', tagline: 'Tanjore paintings', bio: 'Classic paintings with gold foil and stones.' },
  { name: 'Neha Chawla', category: 'Jewelry', location: 'Delhi', tagline: 'Contemporary silver', bio: 'Modern designs using traditional silversmithing.' },
  { name: 'Ramesh Sen', category: 'Textiles', location: 'West Bengal', tagline: 'Jamdani weaves', bio: 'Fine muslin with intricate woven motifs.' },
  { name: 'Asha Bhosle', category: 'Pottery', location: 'Maharashtra', tagline: 'Terracotta art', bio: 'Earthenware for daily use and decor.' },
  { name: 'Dinesh Kumar', category: 'Metal Crafts', location: 'Uttar Pradesh', tagline: 'Brassware', bio: 'Moradabad brass artisan creating intricate engravings.' }
];

async function run() {
  console.log('--- STARTING CLEANUP AND SEED ---');
  
  // 1. Delete all existing products and artisans
  console.log('Deleting existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Deleting existing artisans...');
  await supabase.from('artisans').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insert Artisans
  const artisansToInsert = ARTISANS.map(a => ({
    ...a,
    rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
    created_at: new Date().toISOString()
  }));

  console.log('Inserting 20 Artisans...');
  const { data: insertedArtisans, error: artisanError } = await supabase
    .from('artisans')
    .insert(artisansToInsert)
    .select();

  if (artisanError) {
    console.error('Artisan Insert Error:', artisanError);
    return;
  }

  // 3. Insert Products for each artisan
  const products = [];
  insertedArtisans.forEach((artisan, index) => {
    // 3 products per artisan
    for(let i=1; i<=3; i++) {
      products.push({
        title: `${artisan.category} Masterpiece ${index * 3 + i}`,
        description: `A beautiful ${artisan.category.toLowerCase()} item crafted by ${artisan.name}. ${artisan.bio}`,
        price: Math.floor(Math.random() * 5000) + 500,
        category: artisan.category,
        artisan_name: artisan.name,
        // We'll leave images empty or a simple placeholder, but the frontend will use fallback/skeletons!
        image: '', 
        images: [],
        stock: Math.floor(Math.random() * 20) + 1,
        created_at: new Date().toISOString()
      });
    }
  });

  console.log(`Inserting ${products.length} Products...`);
  const { error: productError } = await supabase
    .from('products')
    .insert(products);

  if (productError) {
    console.error('Product Insert Error:', productError);
  }

  console.log('--- SEED COMPLETE ---');
}

run();
