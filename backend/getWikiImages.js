const https = require('https');
const fs = require('fs');

const crafts = [
  // Artisans
  'Channapatna toys', 'Mysore silk', 'Blue Pottery of Jaipur',
  'Kutch embroidery', 'Pattachitra', 'Banarasi sari',
  
  // Channapatna Products
  'Toy train', 'Wooden elephant', 'Stacking toy',
  
  // Mysore Silk Products
  'Sari', 'Dupatta', 'Stole',
  
  // Blue Pottery Products
  'Pottery', 'Vase', 'Tea set',
  
  // Kutch Embroidery
  'Embroidery', 'Cushion', 'Tapestry',
  
  // Pattachitra
  'Indian art', 'Bookmark', 'Canvas',
  
  // Banarasi Weaver
  'Zari', 'Shawl', 'Silk'
];

function searchWikiImage(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId] && pages[pageId].original) {
            resolve(pages[pageId].original.source);
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
  for (const c of crafts) {
    let img = await searchWikiImage(c);
    if (!img) img = await searchWikiImage(c.split(' ')[0]); // fallback
    results[c] = img;
  }
  fs.writeFileSync('wiki_images.json', JSON.stringify(results, null, 2));
  console.log('Saved to wiki_images.json');
}
run();
