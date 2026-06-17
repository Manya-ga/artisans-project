const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchHtml('https://unsplash.com/s/photos/wooden-toy');
  const matches = [...html.matchAll(/"(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+)[^"]*"/g)];
  const uniqueUrls = [...new Set(matches.map(m => m[1]))];
  console.log(uniqueUrls.slice(0, 5));
}
run();
