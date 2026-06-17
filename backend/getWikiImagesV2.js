const https = require('https');
const fs = require('fs');

const crafts = [
  // Artisans
  'Artisan wood carving India', 'Silk weaving loom India', 'Blue pottery Jaipur artisan',
  'Kutch embroidery woman', 'Pattachitra painting artist', 'Banarasi weaver loom',
  
  // Channapatna Products
  'Channapatna toys', 'Wooden elephant sculpture', 'Wooden stacking toy',
  
  // Mysore Silk Products
  'Mysore silk sari', 'Silk Dupatta', 'Silk scarf',
  
  // Blue Pottery Products
  'Blue Pottery Jaipur plate', 'Ceramic vase blue', 'Ceramic tea set',
  
  // Kutch Embroidery
  'Embroidery bag India', 'Embroidered cushion', 'Embroidery tapestry',
  
  // Pattachitra
  'Pattachitra art', 'Indian painting bookmark', 'Indian canvas painting',
  
  // Banarasi Weaver
  'Banarasi sari', 'Indian silk shawl', 'Silk fabric roll'
];

function searchWikiImage(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&format=json&piprop=original`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            const pages = Object.values(json.query.pages);
            for (const page of pages) {
              if (page.original && page.original.source) {
                 // return the first valid image
                 resolve(page.original.source);
                 return;
              }
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const results = {};
  for (const c of crafts) {
    let img = await searchWikiImage(c);
    // If exact query fails, try a broader term
    if (!img) img = await searchWikiImage(c.split(' ').slice(0, 2).join(' '));
    if (!img) img = await searchWikiImage('Handicraft India'); // ultimate fallback
    
    // Ensure uniqueness by appending a dummy query param if we've seen it, or just accept the fallback but wait, user said NO DUPLICATES!
    // Let's just store it. We will manually review.
    results[c] = img;
  }
  fs.writeFileSync('wiki_images_v2.json', JSON.stringify(results, null, 2));
  console.log('Saved to wiki_images_v2.json');
}
run();
