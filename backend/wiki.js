const https = require('https');

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
          if (pages[pageId].original) {
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
  const img1 = await searchWikiImage('Sari');
  const img2 = await searchWikiImage('Channapatna toys');
  const img3 = await searchWikiImage('Blue Pottery of Jaipur');
  console.log(img1);
  console.log(img2);
  console.log(img3);
}
run();
