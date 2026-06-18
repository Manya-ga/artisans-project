require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// High-quality valid Unsplash image URLs
const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop`;

const categories = [
  'Pottery', 'Handloom', 'Wooden Crafts', 'Jewelry', 'Paintings',
  'Textiles', 'Bamboo Crafts', 'Leather Crafts', 'Home Decor', 'Traditional Art'
];

const artisansData = [
  // Pottery
  { name: 'Khurja Pottery Masters', category: 'Pottery', loc: 'Khurja', state: 'Uttar Pradesh', bio: 'Renowned for our vibrant, hand-painted blue pottery ceramics.', tagline: 'Timeless ceramics from Khurja', rating: 4.8,
    img: img('1560609189-f1f4a7310ffa'), coverImg: img('1578500494198-246f612d3b3d'), products: [
      { title: 'Blue Floral Vase', img: img('1610701596007-11502861dcfa') },
      { title: 'Ceramic Tea Set', img: img('1584622650111-993a426fbf0a') },
      { title: 'Hand-painted Planter', img: img('1485955900006-d0f28d392b8e') },
      { title: 'Decorative Plate', img: img('1594916843477-947385da41cd') }
  ]},
  { name: 'Jaipur Blue Art', category: 'Pottery', loc: 'Jaipur', state: 'Rajasthan', bio: 'Creating traditional Jaipur blue pottery using quartz stone.', tagline: 'The royal blue of Jaipur', rating: 4.9,
    img: img('1531688636-f00e96030c6a'), coverImg: img('1610701596007-11502861dcfa'), products: [
      { title: 'Blue Pottery Lamp', img: img('1513519245088-0e12902e5a38') },
      { title: 'Ceramic Coasters Set', img: img('1605335197825-9c88be24db77') },
      { title: 'Serving Bowl', img: img('1584622650111-993a426fbf0a') }
  ]},

  // Handloom
  { name: 'Balaramapuram Weaves', category: 'Handloom', loc: 'Trivandrum', state: 'Kerala', bio: 'Authentic Kerala Kasavu handlooms woven with fine cotton and golden zari.', tagline: 'The elegance of Kasavu', rating: 4.7,
    img: img('1605001088481-9b1da79b764f'), coverImg: img('1574634534894-89d7576c8259'), products: [
      { title: 'Kasavu Saree', img: img('1611095973763-414019e72400') },
      { title: 'Mundu & Neriyathu', img: img('1584447128309-b66b7a4d1b63') },
      { title: 'Handloom Set Saree', img: img('1605001088481-9b1da79b764f') }
  ]},
  { name: 'Bhujodi Heritage Weavers', category: 'Handloom', loc: 'Bhujodi', state: 'Gujarat', bio: 'Specializing in traditional extra-weft Bhujodi weaving techniques.', tagline: 'Threads of the desert', rating: 4.9,
    img: img('1523301343968-6a6ebf63c672'), coverImg: img('1612241530263-710c1b0ca131'), products: [
      { title: 'Woolen Shawl', img: img('1523301343968-6a6ebf63c672') },
      { title: 'Cotton Stole', img: img('1555529902-5261145633bf') },
      { title: 'Handwoven Throw', img: img('1611095973763-414019e72400') }
  ]},

  // Wooden Crafts
  { name: 'Channapatna Joy Makers', category: 'Wooden Crafts', loc: 'Channapatna', state: 'Karnataka', bio: 'Safe, non-toxic wooden toys colored with vegetable dyes.', tagline: 'Play safe, play natural', rating: 4.8,
    img: img('1596461404969-9ae70f2830c1'), coverImg: img('1616429777191-cc11a3c8bb2a'), products: [
      { title: 'Wooden Toy Train', img: img('1596040033229-a9821ebd058d') },
      { title: 'Stacking Rings', img: img('1596461404969-9ae70f2830c1') },
      { title: 'Spinning Tops', img: img('1616429777191-cc11a3c8bb2a') }
  ]},
  { name: 'Saharanpur Woodworks', category: 'Wooden Crafts', loc: 'Saharanpur', state: 'Uttar Pradesh', bio: 'Intricately carved wooden furniture and home decors.', tagline: 'Masterpieces in wood', rating: 4.9,
    img: img('1603048297172-c92544798d5e'), coverImg: img('1505691938895-1758d7bef511'), products: [
      { title: 'Carved Coffee Table', img: img('1505691938895-1758d7bef511') },
      { title: 'Wooden Wall Panel', img: img('1603048297172-c92544798d5e') },
      { title: 'Jewelry Box', img: img('1596461404969-9ae70f2830c1') }
  ]},
  { name: 'Sankheda Furniture Crafts', category: 'Wooden Crafts', loc: 'Sankheda', state: 'Gujarat', bio: 'Traditional teak wood furniture treated with lacquer colors.', tagline: 'Colorful traditions in wood', rating: 4.7,
    img: img('1505691938895-1758d7bef511'), coverImg: img('1603048297172-c92544798d5e'), products: [
      { title: 'Sankheda Swing', img: img('1505691938895-1758d7bef511') },
      { title: 'Decorative Chair', img: img('1603048297172-c92544798d5e') },
      { title: 'Lacquer Table', img: img('1596461404969-9ae70f2830c1') },
      { title: 'Traditional Stool', img: img('1616429777191-cc11a3c8bb2a') }
  ]},

  // Jewelry
  { name: 'Jaipur Silver Crafts', category: 'Jewelry', loc: 'Jaipur', state: 'Rajasthan', bio: 'Handcrafted oxidized silver and semi-precious stone jewelry.', tagline: 'Adorn yourself in silver', rating: 4.9,
    img: img('1515562141207-8ea4f3c7e7b3'), coverImg: img('1535632066939-bb19c1be3db4'), products: [
      { title: 'Oxidized Silver Necklace', img: img('1515562141207-8ea4f3c7e7b3') },
      { title: 'Amethyst Earrings', img: img('1535632066939-bb19c1be3db4') },
      { title: 'Silver Bangle Set', img: img('1611085583163-fdf6fcb5b8ec') }
  ]},
  { name: 'Dokra Brass Jewelry', category: 'Jewelry', loc: 'Bastar', state: 'Chhattisgarh', bio: 'Ancient lost-wax metal casting jewelry designs.', tagline: 'Rustic metal art', rating: 4.8,
    img: img('1611085583163-fdf6fcb5b8ec'), coverImg: img('1515562141207-8ea4f3c7e7b3'), products: [
      { title: 'Dokra Tribal Necklace', img: img('1515562141207-8ea4f3c7e7b3') },
      { title: 'Brass Elephant Pendant', img: img('1535632066939-bb19c1be3db4') },
      { title: 'Tribal Armlet', img: img('1611085583163-fdf6fcb5b8ec') },
      { title: 'Brass Anklet', img: img('1515562141207-8ea4f3c7e7b3') }
  ]},
  { name: 'Hyderabad Pearl Masters', category: 'Jewelry', loc: 'Hyderabad', state: 'Telangana', bio: 'Authentic fresh water pearls set in gold and silver.', tagline: 'The city of pearls', rating: 4.9,
    img: img('1535632066939-bb19c1be3db4'), coverImg: img('1611085583163-fdf6fcb5b8ec'), products: [
      { title: 'Pearl Choker Set', img: img('1535632066939-bb19c1be3db4') },
      { title: 'Stud Pearl Earrings', img: img('1611085583163-fdf6fcb5b8ec') },
      { title: 'Classic Pearl Strand', img: img('1515562141207-8ea4f3c7e7b3') }
  ]},

  // Paintings
  { name: 'Madhubani Art Collective', category: 'Paintings', loc: 'Madhubani', state: 'Bihar', bio: 'Intricate folk art paintings depicting nature and mythology.', tagline: 'The colors of Mithila', rating: 4.9,
    img: img('1578301978693-851568c0953a'), coverImg: img('1580136608269-1c91da65eeb1'), products: [
      { title: 'Tree of Life Canvas', img: img('1578301978693-851568c0953a') },
      { title: 'Krishna Radha Painting', img: img('1580136608269-1c91da65eeb1') },
      { title: 'Peacock Motif Art', img: img('1578301978693-851568c0953a') }
  ]},
  { name: 'Pattachitra Canvas', category: 'Paintings', loc: 'Raghurajpur', state: 'Odisha', bio: 'Scroll painting on cloth, an ancient tradition of Odisha.', tagline: 'Stories on scroll', rating: 4.8,
    img: img('1580136608269-1c91da65eeb1'), coverImg: img('1578301978693-851568c0953a'), products: [
      { title: 'Dashavatar Scroll', img: img('1580136608269-1c91da65eeb1') },
      { title: 'Jagannath Painting', img: img('1578301978693-851568c0953a') },
      { title: 'Floral Border Painting', img: img('1580136608269-1c91da65eeb1') }
  ]},

  // Textiles
  { name: 'Banarasi Silk Weavers', category: 'Textiles', loc: 'Varanasi', state: 'Uttar Pradesh', bio: 'Weaving luxurious silk sarees with rich gold and silver brocade.', tagline: 'The timeless drape of Kashi', rating: 5.0,
    img: img('1611095973763-414019e72400'), coverImg: img('1574634534894-89d7576c8259'), products: [
      { title: 'Bridal Banarasi Saree', img: img('1574634534894-89d7576c8259') },
      { title: 'Silk Brocade Dupatta', img: img('1611095973763-414019e72400') },
      { title: 'Banarasi Fabric', img: img('1612241530263-710c1b0ca131') }
  ]},
  { name: 'Kalamkari Block Prints', category: 'Textiles', loc: 'Machilipatnam', state: 'Andhra Pradesh', bio: 'Vegetable-dyed hand block prints with intricate floral patterns.', tagline: 'Art on fabric', rating: 4.8,
    img: img('1584447128309-b66b7a4d1b63'), coverImg: img('1605001088481-9b1da79b764f'), products: [
      { title: 'Kalamkari Kurti Fabric', img: img('1605001088481-9b1da79b764f') },
      { title: 'Block Print Saree', img: img('1584447128309-b66b7a4d1b63') },
      { title: 'Cotton Dupatta', img: img('1612241530263-710c1b0ca131') }
  ]},
  { name: 'Kanjivaram Silk Looms', category: 'Textiles', loc: 'Kanchipuram', state: 'Tamil Nadu', bio: 'Authentic heavy silk sarees renowned for durability and shine.', tagline: 'Woven for generations', rating: 4.9,
    img: img('1612241530263-710c1b0ca131'), coverImg: img('1574634534894-89d7576c8259'), products: [
      { title: 'Kanjivaram Silk Saree', img: img('1574634534894-89d7576c8259') },
      { title: 'Half Saree Set', img: img('1612241530263-710c1b0ca131') },
      { title: 'Silk Border Fabric', img: img('1611095973763-414019e72400') },
      { title: 'Silk Stole', img: img('1584447128309-b66b7a4d1b63') }
  ]},

  // Bamboo Crafts
  { name: 'Assam Bamboo Artisans', category: 'Bamboo Crafts', loc: 'Guwahati', state: 'Assam', bio: 'Eco-friendly bamboo furniture and utility items.', tagline: 'Sustainable nature crafts', rating: 4.8,
    img: img('1583090600102-1c2dfc8c7dce'), coverImg: img('1550989460026-5b432a51fa1e'), products: [
      { title: 'Bamboo Easy Chair', img: img('1550989460026-5b432a51fa1e') },
      { title: 'Bamboo Planter Set', img: img('1583090600102-1c2dfc8c7dce') },
      { title: 'Bamboo Lampshade', img: img('1583090600102-1c2dfc8c7dce') }
  ]},
  { name: 'Tripura Cane Works', category: 'Bamboo Crafts', loc: 'Agartala', state: 'Tripura', bio: 'Fine cane weaving and handcrafted accessories.', tagline: 'Woven cane elegance', rating: 4.7,
    img: img('1550989460026-5b432a51fa1e'), coverImg: img('1583090600102-1c2dfc8c7dce'), products: [
      { title: 'Cane Basket', img: img('1583090600102-1c2dfc8c7dce') },
      { title: 'Cane Tray Set', img: img('1550989460026-5b432a51fa1e') },
      { title: 'Handwoven Cane Mat', img: img('1583090600102-1c2dfc8c7dce') }
  ]},
  { name: 'Nagaland Bamboo Baskets', category: 'Bamboo Crafts', loc: 'Dimapur', state: 'Nagaland', bio: 'Traditional utility baskets and containers used by Naga tribes.', tagline: 'Tribal utility crafts', rating: 4.8,
    img: img('1583090600102-1c2dfc8c7dce'), coverImg: img('1550989460026-5b432a51fa1e'), products: [
      { title: 'Harvest Basket', img: img('1550989460026-5b432a51fa1e') },
      { title: 'Bamboo Container', img: img('1583090600102-1c2dfc8c7dce') },
      { title: 'Decorative Bamboo Vase', img: img('1550989460026-5b432a51fa1e') }
  ]},

  // Leather Crafts
  { name: 'Kolkata Leather Crafts', category: 'Leather Crafts', loc: 'Kolkata', state: 'West Bengal', bio: 'Hand-tooled and embossed leather bags and accessories.', tagline: 'Premium leather art', rating: 4.9,
    img: img('1590874103328-eaac2cb9e562'), coverImg: img('1548624316-23f46f497746'), products: [
      { title: 'Embossed Leather Tote', img: img('1590874103328-eaac2cb9e562') },
      { title: 'Leather Wallet', img: img('1548624316-23f46f497746') },
      { title: 'Messenger Bag', img: img('1590874103328-eaac2cb9e562') }
  ]},
  { name: 'Dharavi Leather Goods', category: 'Leather Crafts', loc: 'Mumbai', state: 'Maharashtra', bio: 'Durable, high-quality leather jackets and accessories.', tagline: 'Urban leather flair', rating: 4.8,
    img: img('1548624316-23f46f497746'), coverImg: img('1590874103328-eaac2cb9e562'), products: [
      { title: 'Classic Leather Jacket', img: img('1548624316-23f46f497746') },
      { title: 'Leather Belt', img: img('1590874103328-eaac2cb9e562') },
      { title: 'Travel Duffel', img: img('1548624316-23f46f497746') }
  ]},

  // Home Decor
  { name: 'Moradabad Brass Works', category: 'Home Decor', loc: 'Moradabad', state: 'Uttar Pradesh', bio: 'Exquisite brass artifacts, lamps, and decorative pieces.', tagline: 'The brass city of India', rating: 4.9,
    img: img('1582216131435-0219c6e3b508'), coverImg: img('1591127027503-455c192bd8ec'), products: [
      { title: 'Brass Elephant Showpiece', img: img('1582216131435-0219c6e3b508') },
      { title: 'Vintage Brass Lamp', img: img('1591127027503-455c192bd8ec') },
      { title: 'Brass Wall Sconce', img: img('1582216131435-0219c6e3b508') }
  ]},
  { name: 'Firozabad Glass Arts', category: 'Home Decor', loc: 'Firozabad', state: 'Uttar Pradesh', bio: 'Handblown glass chandeliers and decorative vases.', tagline: 'The glass city', rating: 4.7,
    img: img('1591127027503-455c192bd8ec'), coverImg: img('1582216131435-0219c6e3b508'), products: [
      { title: 'Glass Chandelier', img: img('1591127027503-455c192bd8ec') },
      { title: 'Colorful Glass Vase', img: img('1582216131435-0219c6e3b508') },
      { title: 'Glass Paperweight', img: img('1591127027503-455c192bd8ec') }
  ]},
  { name: 'Agra Marble Inlay', category: 'Home Decor', loc: 'Agra', state: 'Uttar Pradesh', bio: 'Pietra Dura marble inlay work inspired by the Taj Mahal.', tagline: 'Stone inlay masterpieces', rating: 5.0,
    img: img('1603048297172-c92544798d5e'), coverImg: img('1505691938895-1758d7bef511'), products: [
      { title: 'Marble Inlay Table Top', img: img('1505691938895-1758d7bef511') },
      { title: 'Taj Mahal Replica', img: img('1603048297172-c92544798d5e') },
      { title: 'Marble Coaster Set', img: img('1505691938895-1758d7bef511') }
  ]},

  // Traditional Art
  { name: 'Warli Art Collective', category: 'Traditional Art', loc: 'Palghar', state: 'Maharashtra', bio: 'Tribal Warli art reflecting the rhythm of life and nature.', tagline: 'Tribal geometric art', rating: 4.8,
    img: img('1578301978693-851568c0953a'), coverImg: img('1580136608269-1c91da65eeb1'), products: [
      { title: 'Warli Village Painting', img: img('1578301978693-851568c0953a') },
      { title: 'Warli Painted Terracotta Pot', img: img('1580136608269-1c91da65eeb1') },
      { title: 'Warli Canvas Tote', img: img('1578301978693-851568c0953a') }
  ]},
  { name: 'Tanjore Painting Studio', category: 'Traditional Art', loc: 'Thanjavur', state: 'Tamil Nadu', bio: 'Classical South Indian paintings with real gold foil and semi-precious stones.', tagline: 'Divine gold foil art', rating: 5.0,
    img: img('1580136608269-1c91da65eeb1'), coverImg: img('1578301978693-851568c0953a'), products: [
      { title: 'Ganesha Tanjore Painting', img: img('1580136608269-1c91da65eeb1') },
      { title: 'Balaji Tanjore Art', img: img('1578301978693-851568c0953a') },
      { title: 'Saraswati Gold Foil Frame', img: img('1580136608269-1c91da65eeb1') }
  ]}
];

async function runCleanup() {
  console.log('--- STARTING COMPLETE PRODUCTION-GRADE CLEANUP ---');

  // WIPE ALL EXISTING DATA TO ENSURE NO ORPHANED RECORDS
  console.log('Deleting all existing order items...');
  await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Deleting all existing orders...');
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Deleting all existing stories...');
  await supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Deleting all existing messages...');
  await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Deleting all existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Deleting all existing artisans...');
  await supabase.from('artisans').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  let insertedArtisans = [];
  let generatedProducts = [];

  for (let i = 0; i < artisansData.length; i++) {
    const a = artisansData[i];
    
    const { data: artisanData, error: aError } = await supabase.from('artisans').insert({
      name: a.name, category: a.category, bio: a.bio, tagline: a.tagline, rating: a.rating, 
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
      } else {
         console.error('Error creating product:', pError);
      }
    }
  }

  // Rewrite local JSON to ensure Localhost matches Supabase DB
  const localDbData = {
    users: [], profiles: [], wishlists: [],
    products: generatedProducts.map((p, idx) => ({ id: p.id || (idx + 1), title: p.title, name: p.title, price: p.price, image: p.image, artisanName: p.artisan_name, category: p.category })),
    artisans: insertedArtisans.map((a, idx) => ({ id: a.id || (idx + 1), name: a.name, category: a.category, image: a.image, coverImage: artisansData[idx].coverImg, location: a.location, rating: a.rating, tagline: a.tagline, bio: a.bio }))
  };

  fs.writeFileSync(path.resolve(__dirname, 'local_db.json'), JSON.stringify(localDbData, null, 2));
  
  const dataJsContent = `const artisans = ${JSON.stringify(localDbData.artisans, null, 2)};\nconst products = ${JSON.stringify(localDbData.products, null, 2)};\nconst stories = [];\nmodule.exports = { artisans, products, stories };`;
  fs.writeFileSync(path.resolve(__dirname, 'src/data.js'), dataJsContent);

  console.log('Successfully completed production-grade DB cleanup!');
  console.log(`Final Artisan Count: ${insertedArtisans.length}`);
  console.log(`Final Product Count: ${generatedProducts.length}`);
}

runCleanup();
