const https = require('https');
const fs = require('fs');

const crafts = [
  'artisan wood carving', 'silk weaving loom', 'blue pottery artist',
  'kutch embroidery woman', 'indian miniature painting', 'banarasi weaver',
  'wooden toy train', 'wooden elephant toy', 'wooden stacking rings',
  'mysore silk saree', 'silk dupatta', 'silk scarf',
  'blue pottery plate', 'blue ceramic vase', 'blue ceramic tea set',
  'embroidered ethnic bag', 'embroidered cushion', 'embroidered tapestry',
  'indian traditional painting', 'handmade bookmark', 'mini canvas art',
  'banarasi saree', 'indian silk shawl', 'silk fabric roll'
];

function fetchUnsplash(query) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Find photo- IDs in the HTML directly
          const matches = [...data.matchAll(/(?:photo-)[a-zA-Z0-9\-]{10,}/g)];
          if (matches.length > 0) {
             const uniqueIds = [...new Set(matches.map(m => m[0]))].filter(id => id.length > 15);
             resolve(uniqueIds[0]); // Return the first valid ID
          } else {
             resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const results = {};
  for (let i = 0; i < crafts.length; i++) {
    const query = crafts[i];
    let id = await fetchUnsplash(query);
    if (!id) id = await fetchUnsplash(query.split(' ')[0]); // fallback
    results[query] = id ? `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop` : null;
  }
  fs.writeFileSync('unsplash_urls.json', JSON.stringify(results, null, 2));
  console.log('Saved to unsplash_urls.json');
}
run();
