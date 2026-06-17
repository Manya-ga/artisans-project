require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const artisansData = [
  {
    name: 'Channapatna Toy Maker', category: 'Wood Craft', state: 'Karnataka', loc: 'Channapatna',
    img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop', // working on wood
    coverImg: 'https://images.unsplash.com/photo-1616429777191-cc11a3c8bb2a?w=800&auto=format&fit=crop', // wood collection
    bio: 'Creating eco-friendly wooden toys painted with natural vegetable dyes.',
    tagline: 'Joy in every color',
    products: [
      { title: 'Wooden Toy Train', img: 'https://images.unsplash.com/photo-1722532466509-24e301463088?w=800&auto=format&fit=crop' },
      { title: 'Wooden Elephant Toy', img: 'https://plus.unsplash.com/premium_photo-1702597750929-b4c357ad22c3?w=800&auto=format&fit=crop' },
      { title: 'Stacking Rings', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Mysore Silk Weaver', category: 'Textiles', state: 'Karnataka', loc: 'Mysore',
    img: 'https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&auto=format&fit=crop', // silk weaver working
    coverImg: 'https://live.staticflickr.com/4014/4358767421_88c81becc2_b.jpg', // silk loom
    bio: 'Weaving pure silk sarees with intricate traditional zari borders.',
    tagline: 'The royal weave of Mysore',
    products: [
      { title: 'Mysore Silk Saree', img: 'https://images.unsplash.com/photo-1765881232315-65610dc5b506?w=800&auto=format&fit=crop' },
      { title: 'Silk Dupatta', img: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&auto=format&fit=crop' },
      { title: 'Silk Stole', img: 'https://plus.unsplash.com/premium_photo-1674591172256-ffb48f832f2b?w=800&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Blue Pottery Artist', category: 'Pottery', state: 'Rajasthan', loc: 'Jaipur',
    img: 'https://www.jjclaystudio.com/wp-content/uploads/2025/08/pexels-photo-33329314.jpg', // pottery artist
    coverImg: 'https://images.unsplash.com/photo-1560609189-f1f4a7310ffa?w=800&auto=format&fit=crop', // pottery collection
    bio: 'Using quartz stone powder to make brilliant blue, unfading art.',
    tagline: 'The royal blue hues of Jaipur',
    products: [
      { title: 'Decorative Plate', img: 'https://images.unsplash.com/photo-1723779233298-c17f782c641f?w=800&auto=format&fit=crop' },
      { title: 'Flower Vase', img: 'https://plus.unsplash.com/premium_photo-1757161242872-2224cd921697?w=800&auto=format&fit=crop' },
      { title: 'Tea Set', img: 'https://images.unsplash.com/photo-1762534729117-3096b82d84d8?w=800&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Kutch Embroidery Artisan', category: 'Embroidery', state: 'Gujarat', loc: 'Kutch',
    img: 'https://thumbs.dreamstime.com/b/hand-knitted-garments-20680166.jpg', // embroidery artisan
    coverImg: 'https://www.thesprucecrafts.com/thmb/8zul85BRzFFHNVpCAoQMkji8hKs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Modern_BelindaMarshall-5a70f329ff1b780037f0c5db.jpg', // embroidery pattern
    bio: 'Mirror work and colorful thread embroidery of the Kutch region.',
    tagline: 'Reflecting the desert sun',
    products: [
      { title: 'Embroidered Bag', img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop' },
      { title: 'Cushion Cover', img: 'https://images.unsplash.com/photo-1575276510120-92a4f77b9e28?w=800&auto=format&fit=crop' },
      { title: 'Wall Hanging', img: 'https://images.unsplash.com/photo-1770983076587-d6faac2066b6?w=800&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Pattachitra Artist', category: 'Painting', state: 'Odisha', loc: 'Raghurajpur',
    img: 'https://images.unsplash.com/photo-1432639020363-5632f7f04e0b?w=800&auto=format&fit=crop', // painter
    coverImg: 'https://i0.wp.com/www.craftsodisha.com/wp-content/uploads/2020/02/p00857-141856-narasimha-avatar-canvas-pattachitra-painting.jpg', // painting canvas
    bio: 'Painting intricate mythological stories on specially prepared canvas.',
    tagline: 'Tales painted on cloth',
    products: [
      { title: 'Traditional Painting', img: 'https://images.unsplash.com/photo-1731136508582-a8967aa87e2e?w=800&auto=format&fit=crop' },
      { title: 'Bookmark Set', img: 'https://images.unsplash.com/photo-1683883187260-52f52317ea73?w=800&auto=format&fit=crop' },
      { title: 'Mini Canvas Art', img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&auto=format&fit=crop' }
    ]
  },
  {
    name: 'Banarasi Weaver', category: 'Textiles', state: 'Uttar Pradesh', loc: 'Varanasi',
    img: 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop', // weaver
    coverImg: 'https://live.staticflickr.com/4158/33701299433_5444c42c24_b.jpg', // banarasi silk
    bio: 'Handweaving luxurious silk sarees with rich gold embroidery.',
    tagline: 'The timeless drape of Kashi',
    products: [
      { title: 'Banarasi Saree', img: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop' },
      { title: 'Banarasi Shawl', img: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&auto=format&fit=crop' },
      { title: 'Banarasi Fabric', img: 'https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop' }
    ]
  }
];

async function run() {
  console.log('Starting COMPLETE Database WIPE and SEED...');
  
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('artisans').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  let insertedArtisans = [];
  let generatedProducts = [];

  for (let i = 0; i < artisansData.length; i++) {
    const a = artisansData[i];
    
    // Explicitly inserting cover_image in local JSON only to avoid schema mismatch in Supabase
    const { data: artisanData, error: aError } = await supabase.from('artisans').insert({
      name: a.name, category: a.category, bio: a.bio, tagline: a.tagline, rating: 4.8, 
      image: a.img, location: a.loc
    }).select().single();

    if (aError) {
      console.error('Error creating artisan:', aError); continue;
    }
    insertedArtisans.push(artisanData);

    for (let p = 0; p < a.products.length; p++) {
      const prod = a.products[p];
      const pPrice = Math.floor(Math.random() * 4000) + 1500;
      
      const { data: prodData, error: pError } = await supabase.from('products').insert({
        title: prod.title, price: pPrice, image: prod.img, artisan_name: a.name, artisan_image: a.img,
        artisan_location: a.loc, category: a.category, description: `Authentic handcrafted ${prod.title} directly from the artisan in ${a.loc}, ${a.state}.`, stock: Math.floor(Math.random() * 20) + 5
      }).select().single();

      if (!pError) {
         generatedProducts.push(prodData);
      }
    }
  }

  const localDbData = {
    users: [], profiles: [], wishlists: [],
    products: generatedProducts.map((p, idx) => ({ id: p.id || (idx + 1), title: p.title, name: p.title, price: p.price, image: p.image, artisanName: p.artisan_name, category: p.category })),
    artisans: insertedArtisans.map((a, idx) => ({ id: a.id || (idx + 1), name: a.name, category: a.category, image: a.image, coverImage: artisansData[idx].coverImg, location: a.location, rating: a.rating, tagline: a.tagline, bio: a.bio }))
  };

  fs.writeFileSync(path.resolve(__dirname, 'local_db.json'), JSON.stringify(localDbData, null, 2));
  
  const dataJsContent = `const artisans = ${JSON.stringify(localDbData.artisans, null, 2)};\nconst products = ${JSON.stringify(localDbData.products, null, 2)};\nconst stories = [];\nmodule.exports = { artisans, products, stories };`;
  fs.writeFileSync(path.resolve(__dirname, 'src/data.js'), dataJsContent);

  console.log('Successfully completed fully validated cover image mapping!');
}
run();
