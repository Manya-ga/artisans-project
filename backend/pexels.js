const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchHtml('https://www.pexels.com/search/wooden%20toy/');
  const matches = [...html.matchAll(/src="(https:\/\/images\.pexels\.com\/photos\/[0-9]+\/pexels-photo-[0-9]+\.jpeg[^"]*)"/g)];
  const uniqueUrls = [...new Set(matches.map(m => m[1]))];
  console.log('Pexels unique images:', uniqueUrls.length);
  console.log(uniqueUrls.slice(0, 5));
}
run();
