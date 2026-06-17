const google = require('googlethis');
const fs = require('fs');

const queries = [
  'channapatna wooden toy making site:unsplash.com', 'silk weaving loom artisan site:unsplash.com', 'blue pottery artist site:unsplash.com',
  'kutch embroidery woman site:unsplash.com', 'indian miniature painting site:unsplash.com', 'banarasi weaver site:unsplash.com',
  'wooden toy train site:unsplash.com', 'wooden elephant toy site:unsplash.com', 'wooden stacking rings site:unsplash.com',
  'silk saree site:unsplash.com', 'silk dupatta scarf site:unsplash.com', 'silk scarf site:unsplash.com',
  'blue pottery plate ceramic site:unsplash.com', 'blue ceramic vase site:unsplash.com', 'blue ceramic tea set site:unsplash.com',
  'embroidered ethnic bag site:unsplash.com', 'embroidered cushion cover site:unsplash.com', 'embroidered tapestry site:unsplash.com',
  'indian traditional painting site:unsplash.com', 'handmade bookmark site:unsplash.com', 'mini canvas art site:unsplash.com',
  'banarasi saree site:unsplash.com', 'indian silk shawl site:unsplash.com', 'silk fabric roll site:unsplash.com'
];

async function run() {
  const results = [];
  const options = { page: 0, safe: true };
  
  for (const q of queries) {
    try {
      const images = await google.image(q, options);
      if (images && images.length > 0) {
        results.push({
          query: q.replace(' site:unsplash.com', ''),
          url: images[0].url
        });
      } else {
        results.push({
          query: q.replace(' site:unsplash.com', ''),
          url: null
        });
      }
    } catch (e) {
      console.error('Error for', q, e.message);
      results.push({ query: q.replace(' site:unsplash.com', ''), url: null });
    }
  }
  
  fs.writeFileSync('google_images.json', JSON.stringify(results, null, 2));
  console.log('Saved to google_images.json');
}

run();
