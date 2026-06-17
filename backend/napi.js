const https = require('https');

function fetchNapi(query) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results.map(r => r.urls.regular));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const images = await fetchNapi('wooden toy');
  console.log(images);
}
run();
